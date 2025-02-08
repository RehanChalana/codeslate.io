import Janus from "janus-gateway";
import adapter from "webrtc-adapter";
import {useState, useRef, useEffect} from "react";

const VideoRoom = ({roomId}) => {

    console.log(roomId)

    
    const [remoteStream, setRemoteStream] = useState(new MediaStream())
    const [remoteScreen, setRemoteScreen] = useState(new MediaStream())

    const [streamArr, setStreamArr] = useState([]) 

    const janus = useRef(null)
    const pubHandleRef = useRef(null)
    const subHandleRef = useRef(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localScreenRef = useRef(null)
    const remoteScreenRef = useRef(null)
    const pubScreenRef = useRef(null)

    const turnServerUsername = import.meta.env.VITE_TURN_SERVER_USERNAME
    const turnServerPassword = import.meta.env.VITE_TURN_SERVER_PASSWORD

    const janusUrl = "ws://per-deaf.gl.at.ply.gg:49435"
    // const janusUrl = "ws://172.28.24.133:8188"

    if(remoteStream.getTracks().length > 0) {
        remoteVideoRef.current.srcObject = remoteStream
    }

    if(remoteScreen.getTracks().length > 0) {
        remoteScreenRef.current.srcObject = remoteScreen
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

    const sendOffer = () => {
        // getting user media
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            localVideoRef.current.srcObject = stream
            // creating offer 
            pubHandleRef.current.createOffer({
                tracks : [
                    { type: 'audio', capture: true, recv: true },
                    { type: 'video', capture: true, recv: true },
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

    const handleRemoteScreen = (track, mid, added, metadata) => {
        if(added) {
            setRemoteScreen(prevStream => {
                const newStream = new MediaStream();
                // Add any existing tracks from the previous stream
                prevStream.getTracks().forEach(t => newStream.addTrack(t));
                // Add the new track
                newStream.addTrack(track);

                return newStream;
            })
        } else {
            setRemoteScreen(prevStream => {
                const newStream = new MediaStream();
                prevStream.getTracks().forEach(t => {
                    if (t !== track) {
                        newStream.addTrack(t);
                    }
                });
                
                return newStream;
            })
        }
    }
    
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
                if(metadata.type === "screen") {
                    console.log(metadata)
                    handleRemoteScreen(track, mid , added, metadata)
                } else {
                    handleRemoteStream(track, mid, added, metadata)
                }
                
            }

        })
    }

    const sendOfferForScreen = () => {
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        }).then((stream) => {
            localScreenRef.current.srcObject = stream
            // creating offer 
            pubScreenRef.current.createOffer({
                tracks : [
                    { type: 'audio', capture: true, recv: true },
                    { type: 'video', capture: true, recv: true },
                ],
                success: (jsep) => {
                    // sending the actual offer with udp
                    pubScreenRef.current.send({
                        message: {
                            request: "publish",
                            descriptions : [
                            {
                                    "mid" : "screen",
                                    "description" : "screen"
                            },
                            // Other descriptions, if any
                            ]
                        },
                        jsep
                    })
                }
            })
        })
    
    }

    const startScreenShare = () => {
        janus.current.attach({
            plugin : "janus.plugin.videoroom",
            success: (pluginHandle) => {
                pubScreenRef.current = pluginHandle
                console.log("Plugin attached for screen sharing")
                pluginHandle.send({
                    message: {
                        request: "join",
                        ptype: "publisher",
                        room: roomId
                    }
                })
            },
            onmessage : (msg, jsep) => {
                if(msg.videoroom === "joined") {
                    sendOfferForScreen()
                } else if(jsep){
                    pubScreenRef.current.handleRemoteJsep({jsep : jsep})
                }
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
        <div>
            <div>
                <video ref = {localVideoRef} autoPlay muted></video>
            </div>

            <div>
                <video ref = {remoteVideoRef} autoPlay ></video>
            </div>

            <div>
                <button onClick={startScreenShare}>Share Screen</button>
                <video ref = {localScreenRef} autoPlay muted></video>
                <video ref = {remoteScreenRef} autoPlay></video>
            </div>
        </div>
    )
}

export default VideoRoom