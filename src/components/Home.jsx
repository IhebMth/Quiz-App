import { Link } from 'react-router-dom';

const HomePage = () => {
  const exercises = [
    {
      title: "Drag and Drop",
      description: "Practice English with drag and drop exercises",
      path: "/drag-and-drop"
    },
    {
      title: "Fill in the Blanks",
      description: "Practice English with fill in the blanks exercises",
      path: "/fill-in-the-blanks"
    },
    {
      title: "Gap Fill",
      description: "Practice English with gap fill exercises",
      path: "/gap-fill"
    },
    {
      title: "Highlight Text",
      description: "Practice English with highlighting exercises",
      path: "/highlight"
    },
    {
      title: "Click to Change",
      description: "Practice English with click to change exercises",
      path: "/click-to-change"
    },
    {
      title: "Single Answer",
      description: "Practice English with single answer questions",
      path: "/single-answer"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="p-4 text-sm text-gray-600 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          {" / "}
          <Link to="/exercises" className="hover:text-blue-600">Exercises & Tests</Link>
          {" / "}
          <span className="text-gray-400">A & An</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Exercise Content */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz: A & An</h1>
              <p className="text-gray-600">
                This is a beginner/elementary level quiz containing 25 multiple choice questions.
                Simply answer the questions and press the check button to see your score.
              </p>
            </div>

            {/* Exercise Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {exercise.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {exercise.description}
                    </p>
                    <Link
                      to={exercise.path}
                      className="inline-block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
                    >
                      Start Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Subscribe Section */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Subscribe to Ad-Free Browsing
              </h2>
              <p className="text-gray-600 mb-6">
                Enjoy a seamless learning experience without interruptions from advertisements.
              </p>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;