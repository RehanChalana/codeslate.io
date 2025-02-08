import Janus from "janus-gateway";
import adapter from "webrtc-adapter";
import {useState, useRef, useEffect} from "react";

const VideoRoom = ({roomId}) => {

    console.log(roomId)

    
    const [remoteStream, setRemoteStream] = useState(new MediaStream())
    const [localStream, setLocalStream] = useState(new MediaStream())
    const [streamArr, setStreamArr] = useState([]) 
    const [isAudioMuted, setIsAudioMuted] = useState(false)
    const [isVideoMuted, setIsVideoMuted] = useState(false)


    const janus = useRef(null)
    const pubHandleRef = useRef(null)
    const subHandleRef = useRef(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)

    const turnServerUsername = import.meta.env.VITE_TURN_SERVER_USERNAME
    const turnServerPassword = import.meta.env.VITE_TURN_SERVER_PASSWORD

    const janusUrl = "ws://per-deaf.gl.at.ply.gg:49435"
    // const janusUrl = "ws://172.28.24.133:8188"

    if(remoteStream.getTracks().length > 0) {
        remoteVideoRef.current.srcObject = remoteStream
    }


    // defining stun and turn servers to be used in janus
    const iceServers = [
        
        {urls: "stun:stun4.l.google.com:19302" },
        {urls: "stun:stun.relay.metered.ca:80"},
        {
            urls: [
                "turn:global.relay.metered.ca:80",
                "turn:global.relay.metered.ca:80?transport=tcp",
                "turn:global.relay.metered.ca:443",
                "turns:global.relay.metered.ca:443?transport=tcp"
            ],
            username: turnServerUsername,
            credential: turnServerPassword,
        }
    ]


    const toggleAudio =() => {
        if(localStream) {
            const audioTrack = localStream.getAudioTracks()[0]
            if(audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsAudioMuted(!isAudioMuted)

                pubHandleRef.current.send({
                    message: {
                        request: "configure",
                        audio: audioTrack.enabled
                    }
                })
            }
        }
    }

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoMuted(!videoTrack.enabled);
                
                // Send configuration update to Janus
                pubHandleRef.current?.send({
                    message: {
                        request: "configure",
                        video: videoTrack.enabled
                    }
                });
            }
        }
    };

    const sendOffer = () => {
        // getting user media
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            setLocalStream(stream)
            localVideoRef.current.srcObject = stream
            // creating offer 
            pubHandleRef.current.createOffer({
                tracks : [
                    { type: 'audio', capture: true, recv: true, mid: 1 },
                    { type: 'video', capture: true, recv: true, mid: 2 },
                ],
                success: (jsep) => {
                    // sending the actual offer with udp
                    pubHandleRef.current.send({
                        message: {
                            request: "publish"
                        },
                        jsep
                    })
                }
            })
        })
    }

    const handleOffer = (jsep) => {
        subHandleRef.current.createAnswer({
            jsep : jsep,
            success: (ansJsep) => {
                // sending answer
                subHandleRef.current.send({
                    message: {
                        request : "start"
                    }, jsep : ansJsep
                })
            }
        })
    }

    const handleRemoteStream = (track, mid, added, metadata) => {
        if (added) {
            setRemoteStream(prevStream => {
                const newStream = new MediaStream();
                // Add any existing tracks from the previous stream
                prevStream.getTracks().forEach(t => newStream.addTrack(t));
                // Add the new track
                newStream.addTrack(track);
                return newStream;
            });
        } else {
            // Similar handling for track removal using the functional update:
            setRemoteStream(prevStream => {
                const newStream = new MediaStream();
                prevStream.getTracks().forEach(t => {
                    if (t !== track) {
                        newStream.addTrack(t);
                    }
                });
                return newStream;
            });
        }
    };

    
    const handleNewPublishers = (publisher) => {
        if(!subHandleRef.current) {
            joinAsSubscriber(publisher)
            return
        }


        let newStreams = publisher.map((pub) => {
            return {feed : pub.id}
        })




        subHandleRef.current.send({
            message: {
                request: "subscribe",
                streams: newStreams
            },
            
        })
    }

    const sendJoinAsPublisher = () => {
        // sending initial request to join the room
        // it enables you to listen to room activities and get the list of publishers
        // it does not make you a active publisher yet 
        // because no media is being shared and there is no webrtc connection

        pubHandleRef.current.send({
            message : {
                request: "join",
                ptype: "publisher",
                room: roomId
            }
        })
    }


    // attaching to video room plugin as a publisher
    const joinAsPublisher = () => {
        janus.current.attach({
            plugin: 'janus.plugin.videoroom',
            error: (error) => console.log("Error attaching to videoroom plugin as a publisher: ",error),
            success: (pluginHandle) => {
                pubHandleRef.current = pluginHandle
                // checking if the room exists
                pluginHandle.send({
                    message: {
                        request: "exists",
                        room: roomId
                    },
                    success: (result) => {
                        if(result.exists) {
                            sendJoinAsPublisher()
                        } else {
                            pluginHandle.send({
                                message: {
                                    request: "create",
                                    room: roomId
                                }, 
                                success : (result) => {
                                    if(result.videoroom === "created") {
                                        sendJoinAsPublisher()
                                    }
                                }
                            })
                        }
                    }
                }
                )
                
            },
            onmessage: (msg, jsep) => {

                // send offer if room is joined
                if(msg.videoroom === "joined") {
                    sendOffer()
                    if(msg.publishers && msg.publishers.length > 0) {
                        joinAsSubscriber(msg.publishers)
                    }
                    
                } else if(jsep) {
                    pubHandleRef.current.handleRemoteJsep({jsep : jsep})
                } else if(msg.publishers) {
                    handleNewPublishers(msg.publishers)
                } 
            }
        })
    }

    const joinAsSubscriber = (publishers) => {

        if(publishers.length == 0) return
        console.log(publishers)
        // creating streams array that will be used to subscribe 
        const streams = publishers.map((pub) => {
            return ({feed : pub.id})
        })
        setStreamArr(streams)

        janus.current.attach({
            plugin: "janus.plugin.videoroom",
            success: (pluginHandle) => {
                subHandleRef.current = pluginHandle
                console.log("attached videoroom plugin for subscriptions")
                // sending initial request to join the room as a subscriber
                pluginHandle.send({
                    message : {
                        request: "join",
                        room: roomId,
                        ptype: "subscriber",
                        streams
                    }
                })
            },
            onmessage: (msg, jsep) => {
                if(jsep) {
                    handleOffer(jsep)
                } else if(msg.started === "ok") {
                    console.log("WebRTC Connection established for subscription")
                } else {
                    console.log("sub handle got a message",msg)
                }
            },
            onremotetrack: (track, mid, added, metadata) => {
                console.log(track, mid, added, metadata)
                
                    handleRemoteStream(track, mid, added, metadata)
                
            }

        })
    }

    useEffect(() => {
        Janus.init({
            debug: true,
            dependencies: Janus.useDefaultDependencies({adapter : adapter}),
            callback: () => {
                janus.current = new Janus({
                    server: janusUrl,
                    iceServers: iceServers,
                    error: (error) => console.error("Error creating janus connection: ", error),
                    success: () => {
                        console.log("Connected to the janus ready to start a call!")
                        joinAsPublisher()
                    }
                })    
                
            }
        })
    },[])


    return (
        <div className="p-4">
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <video ref={localVideoRef} autoPlay muted className="w-full max-w-md border rounded-lg"></video>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <button 
                            onClick={toggleAudio}
                            className={`px-4 py-2 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        >
                            {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                        </button>
                        <button 
                            onClick={toggleVideo}
                            className={`px-4 py-2 rounded-full ${isVideoMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        >
                            {isVideoMuted ? 'Enable Video' : 'Disable Video'}
                        </button>
                    </div>
                </div>

                <div>
                    <video ref={remoteVideoRef} autoPlay className="w-full max-w-md border rounded-lg"></video>
                </div>
            </div>
        </div>
    )
}

export default VideoRoom