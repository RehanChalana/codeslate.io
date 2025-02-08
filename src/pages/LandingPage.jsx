import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login button clicked");
    navigate("/login");
  };

  const handleSignUp = () => {
    console.log("Sign Up button clicked");
    navigate("/signup");
  };

  const handleGoPremium = () => {
    console.log("Go Premium button clicked");
    navigate("/login");
  };

  const handleStartForFree = () => {
    console.log("Start for Free button clicked");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-black m-5">
        <div className="space-x-4 flex">
          <div className="text-4xl text-center font-semibold text-gradient">
            <span className="text-[#e2ff24]">&lt;/</span>
            <span className="text-white">codeslate.io</span>
            <span className="text-[#24fe41]">&gt;</span>
          </div>
          {/* <button
                        className="bg-transparent border border-gray-600 text-white px-[5vh] py-2 h-11 rounded-[10px] hover:bg-gray-800"
                        onClick={handleLogin}
                    >
                        ABOUT
                    </button>
                    <button
                        className="bg-transparent border border-gray-600 text-white px-6 py-2 h-11 rounded-[10px] hover:bg-gray-800"
                        onClick={handleLogin}
                    >
                        CONTACT US
                    </button> */}
        </div>
        <div className="space-x-4">
          <button
            className="bg-transparent border cursor-pointer border-[#24fe41] text-white px-7 h-11 rounded-md hover:bg-gray-800"
            onClick={handleLogin}
          >
            LOGIN
          </button>
          <button
            className="bg-gradient-to-r from-[#e2ff24] to-[#24fe41] cursor-pointer text-black px-[2.5vh] h-11 rounded-md hover:bg-green-600 font-medium text-sm"
            onClick={handleSignUp}
          >
            SIGN UP
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center mt-1 p-24 bg-[#141414] w-[95vw] h-[70vh] mr-[11vw] rounded-tr-full">
        <h2 className="text-4xl tracking-wide md:text-8xl font-bold mb-10 mr-[9vw] leading-[1.2] md:leading-[1.3]">
          One Step Solution <br /> for Coding Interviews
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mb-10 w-3xl text-left ml-[21vw]">
          It provides a platform for developers to collaborate in real-time,
          enabling them to discuss, write, and refine code together efficiently.
        </p>
        <div className="flex space-x-4 mt-14 justify-center">
          <button
            className="bg-gradient-to-r from-[#e2ff24] to-[#24fe41] text-black px-12 py-3 rounded-md text-xl font-medium hover:bg-green-600 cursor-pointer "
            onClick={handleGoPremium}
          >
            GO PREMIUM
          </button>
          <button
            className="bg-transparent border cursor-pointer border-gray-600 text-white px-12 py-3 rounded-md text-lg mr-40 font-semibold hover:bg-gray-800"
            onClick={handleStartForFree}
          >
            START FOR FREE
          </button>
        </div>
      </div>

      {/* Additional Section */}
      <div className="text-left pt-24 pl-[25vw] bg-[#141414] w-[95vw] h-[70vh] mr-[11vw] ">
        <h3 className="bg-gradient-to-r from-[#e2ff24] to-[#24fe41] text-transparent bg-clip-text text-9xl font-bold opacity-60">
          &lt;/Code&gt;
        </h3>
        <h3 className="bg-gradient-to-r from-[#e2ff24] to-[#24fe41] text-transparent bg-clip-text text-9xl font-bold opacity-80">
          &lt;/Connect&gt;
        </h3>
        <h3 className="bg-gradient-to-r from-[#e2ff24] to-[#24fe41] text-transparent bg-clip-text text-9xl font-bold">
          &lt;/Evaluate&gt;
        </h3>
      </div>

      {/* Services Section */}
      <div className="pl-50 pr-40 bg-[#141414] w-[95vw] mr-[11vw]">
        <h2 className="md:text-6xl font-semibold  mb-8 tracking-wider text-left">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-3 mt-15">
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">📹</div>
            <h3 className="text-3xl mt-10">Audio and Video</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Conduct live discussions with candidates via audio and video.
              Explain technical concepts, review their solutions, and assess
              communication skills as if you were in a real interview setting.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">📋</div>
            <h3 className="text-3xl mt-10">Custom Test Cases</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Allow interviewers to define and run custom test cases to evaluate
              a candidate’s code against specific edge cases and real-world
              scenarios. Ensure accuracy, efficiency, and robustness in their
              solutions.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">🖊️</div>
            <h3 className="text-3xl mt-10">Whiteboard Mode</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Engage in real-time problem-solving with an interactive
              whiteboard. Illustrate concepts, write algorithms, and collaborate
              visually to evaluate candidates’ approach to challenges.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">📝</div>
            <h3 className="text-3xl mt-10">Private Notes</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Take notes as you interview the candidate so you can review and
              compare later. These are only available to you and your team.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">🔗</div>
            <h3 className="text-3xl mt-10">Invite via Link</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Copy and share the interview URL in advance or invite candidates
              via email once you start.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <div className="text-green-500 text-6xl mb-4">💻</div>
            <h3 className="text-3xl mt-10">Real-time Environment</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Provide a built-in coding editor for candidates to write, compile,
              and run code in real-time, supporting multiple programming
              languages.
            </p>
          </div>
        </div>
      </div>

      {/* Why Codeslate Section */}
      <div className="pl-50 pr-40 pt-20 bg-[#141414] w-[95vw] mr-[11vw]">
        <h2 className="md:text-6xl font-semibold  mb-8 tracking-wider text-left">
          Why codeslate.io?
        </h2>
        <div className="grid md:grid-cols-3 gap-3 mt-15">
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <h3 className="text-3xl mt-2">Why interview without a compiler?</h3>
            <p className="text-gray-400 text-xl mt-4 tracking-wider">
              Codeslate.io is an online code interview tool that empowers both
              candidates and interviewers to solve coding problems in real-time
              with an online code editor and compilers for all popular
              languages.
            </p>
            <p className="text-[#525252] text-5xl text-right mt-5 font-bold tracking-wider">
              &lt;/&gt;
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <h3 className="text-3xl mt-2">Intuitive Coding Interface</h3>
            <p className="text-gray-400 text-2xl mt-4 tracking-wider">
              A seamless, developer-friendly environment to write, compile, and
              run code efficiently. Easily switch between dark and light mode
              for a comfortable experience.
            </p>
            <p className="text-[#525252] text-5xl text-right mt-5 font-bold tracking-wider relative bottom-0">
              &lt;/&gt;
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-2xl pb-10 w-90">
            <h3 className="text-3xl mt-2">Ready to Use</h3>
            <p className="text-gray-400 text-2xl mt-4 tracking-wider">
              Conduct coding interviews instantly without requiring candidates
              to install an IDE or additional software. Simply create an
              interview, share the link, and start coding in a fully equipped
              online environment.
            </p>
            <p className="relative bottom-6 text-[#525252] text-5xl text-right mt-5 font-bold tracking-wider">
              &lt;/&gt;
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="pl-50 pr-40 pt-20 bg-[#141414] w-[95vw] mr-[11vw]">
        <h2 className="md:text-5xl font-semibold mb-12 tracking-wider text-left">
          Supported Languages
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 justify-items-center ">
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
              alt="JavaScript"
              className="h-16 mb-2"
            />
            <span className="text-gray-400">JavaScript</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg"
              alt="Java"
              className="h-16 mb-2"
            />
            <span className="text-gray-400">Java</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
              alt="C"
              className="h-16 mb-2"
            />
            <span className="text-gray-400">C</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg"
              alt="C++"
              className="h-16 mb-2"
            />
            <span className="text-gray-400">C++</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
              alt="Python"
              className="h-16 mb-2"
            />
            <span className="text-gray-400">Python</span>
          </div>

        </div>
      </div>

      {/* Footer Section */}
      <footer className="pl-51 pr-40 pt-20 bg-[#141414] w-[95vw] mr-[11vw]">
        <div className="mb-8 pl-[40vw]">
          <p className="text-gray-400 text-lg">CONTACT US</p>
          <h2 className="md:text-6xl font-semibold  mb-8 w-[40vw] tracking-wider text-left">
            Want to Interview with us?
          </h2>
          <p className="text-gray-400 mt-2 w-[35vw] md:text-2xl">
            Streamline your technical hiring process with our powerful coding
            interview platform. Collaborate, evaluate, and hire the best
            talent—all in one place.
          </p>
        </div>
        <div className="flex gap-15">
          <div className="text-left">
            <div className="flex gap-5">
              <div className="mb-4">
                <p className="text-gray-400 text-lg pb-2">CONTACT</p>
                <p className="text-white">codeslate.io@cio.com</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-400 text-lg pb-2 ">By</p>
                <p className="text-white">Code Hashiras</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-lg pb-3">FOLLOW US</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400">
                  Instagram
                </a>
                <a href="#" className="text-gray-400">
                  Facebook
                </a>
                <a href="#" className="text-gray-400">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <form className="text-left mb-8 pl-[14vw]">
            <input
              type="text"
              placeholder="Name"
              className="w-full md:w-1/2 p-2 mb-4 transparent text-white border-b-1 border-[#3d3d3d] rounded placeholder-white"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full md:w-1/2 p-2 mb-4 transparent text-white border-b-1 border-[#3d3d3d] rounded placeholder-white"
            />
            <textarea
              placeholder="Project details (optional)"
              className="w-full p-2 mb-4 transparent text-white border-b-1 border-[#3d3d3d] rounded placeholder-white"
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-black px-20 py-4 rounded-md font-semibold hover:bg-green-600"
            >
              SEND
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
