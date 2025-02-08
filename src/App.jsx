import React from "react";

const App = () => {
  const handleLogin = () => {
    console.log("Login button clicked");
  };

  const handleSignUp = () => {
    console.log("Sign Up button clicked");
  };

  const handleGoPremium = () => {
    console.log("Go Premium button clicked");
  };

  const handleStartForFree = () => {
    console.log("Start for Free button clicked");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-black">
        <h1 className="text-2xl font-bold text-green-500">&lt;codeslate.io&gt;</h1>
        <div className="space-x-4">
          <button
            className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-black px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center mt-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          One Step Solution <br /> for Coding
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          It provides a platform for developers to collaborate in real-time,
          enabling them to discuss, write, and refine code together efficiently.
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            className="bg-green-500 text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600"
            onClick={handleGoPremium}
          >
            Go Premium
          </button>
          <button
            className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800"
            onClick={handleStartForFree}
          >
            Start for Free
          </button>
        </div>
      </div>

      {/* Additional Section */}
      <div className="text-center mt-16">
        <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          &lt;Code&gt;
        </h3>
        <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          &lt;Connect&gt;
        </h3>
        <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          &lt;Evaluate&gt;
        </h3>
      </div>

      {/* Why Codeslate Section */}
      <div className="mt-16 px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why codeslate.io?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Why interview without a compiler?</h3>
            <p className="text-gray-400">
              Codeslate.io is an online code interview tool that empowers both candidates and interviewers to solve coding problems in real-time with an online code editor and compilers for all popular languages.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-green-500">Intuitive Coding Interface</h3>
            <p className="text-gray-400">
              A seamless, developer-friendly environment to write, compile, and run code efficiently. Easily switch between dark and light mode for a comfortable experience.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Ready to Use</h3>
            <p className="text-gray-400">
              Conduct coding interviews instantly without requiring candidates to install an IDE or additional software. Simply create an interview, share the link, and start coding in a fully equipped online environment.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-16 px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">📹</div>
            <h3 className="text-xl font-bold mb-2">Audio and Video</h3>
            <p className="text-gray-400">
              Conduct live discussions with candidates via audio and video. Explain technical concepts, review their solutions, and assess communication skills as if you were in a real interview setting.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Custom Test Cases</h3>
            <p className="text-gray-400">
              Allow interviewers to define and run custom test cases to evaluate a candidate’s code against specific edge cases and real-world scenarios. Ensure accuracy, efficiency, and robustness in their solutions.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">🖊️</div>
            <h3 className="text-xl font-bold mb-2">Whiteboard Mode</h3>
            <p className="text-gray-400">
              Engage in real-time problem-solving with an interactive whiteboard. Illustrate concepts, write algorithms, and collaborate visually to evaluate candidates’ approach to challenges.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">Private Notes</h3>
            <p className="text-gray-400">
              Take notes as you interview the candidate so you can review and compare later. These are only available to you and your team.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">Invite via Link</h3>
            <p className="text-gray-400">
              Copy and share the interview URL in advance or invite candidates via email once you start.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-green-500 text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">Real-time Environment</h3>
            <p className="text-gray-400">
              Provide a built-in coding editor for candidates to write, compile, and run code in real-time, supporting multiple programming languages.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="mt-16 px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" alt="HTML5" className="h-16 mb-2" />
            <span className="text-gray-400">HTML5</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" alt="CSS3" className="h-16 mb-2" />
            <span className="text-gray-400">CSS3</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" className="h-16 mb-2" />
            <span className="text-gray-400">JavaScript</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://d1.awsstatic.com/logos/aws-rds/Amazon-RDS_Logo_Horizontal.61666a25575b43cfb57269d66a6a38c9.png" alt="Amazon RDS" className="h-16 mb-2" />
            <span className="text-gray-400">Amazon RDS</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://d1.awsstatic.com/logos/aws-er-graphics/Amazon-EventBridge-CloudWatch-Logs-Icon.e05b9e1a4c48d52657226a61554eabdd.png" alt="Amazon ERC" className="h-16 mb-2" />
            <span className="text-gray-400">Amazon ERC</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://d1.awsstatic.com/logos/aws-cloudformation/AWS-CloudFormation_Icon.4b23f8b1f28d79b70cd8e8d7bb4a2f26.png" alt="AWS CloudFormation" className="h-16 mb-2" />
            <span className="text-gray-400">AWS CloudFormation</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://cdn.worldvectorlogo.com/logos/apache-kafka.svg" alt="Kafka" className="h-16 mb-2" />
            <span className="text-gray-400">Kafka</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-black text-white mt-16 py-8 px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Want to Interview with us?</h2>
          <p className="text-gray-400 mt-2">
            Streamline your technical hiring process with our powerful coding interview platform. Collaborate, evaluate, and hire the best talent—all in one place.
          </p>
        </div>
        <form className="text-center mb-8">
          <input
            type="text"
            placeholder="Name"
            className="w-full md:w-1/3 p-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full md:w-1/3 p-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
          />
          <textarea
            placeholder="Project details (optional)"
            className="w-full md:w-1/3 p-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
          ></textarea>
          <button
            type="submit"
            className="bg-green-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-green-600"
          >
            Send
          </button>
        </form>
        <div className="text-center">
          <div className="mb-4">
            <p className="text-gray-400">PROJECT INQUIRIES</p>
            <p className="text-gray-400">madhav1335.be23@chitkara.edu.in</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">CAREERS</p>
            <p className="text-gray-400">Chitkara University</p>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400">Instagram</a>
            <a href="#" className="text-gray-400">Facebook</a>
            <a href="#" className="text-gray-400">LinkedIn</a>
            <a href="#" className="text-gray-400">Twitter</a>
          </div>
          <p className="text-gray-400 mt-4">© 2022 SoftKit. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default App;