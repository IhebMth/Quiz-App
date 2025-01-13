import { Rocket, Book, Users, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Book className="w-8 h-8 text-blue-600" />,
      title: "Interactive Learning",
      description: "Engage with our diverse range of interactive language exercises designed for effective learning."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community Driven",
      description: "Join our growing community of language learners from around the world."
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: "Modern Approach",
      description: "Experience language learning through cutting-edge educational technology."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "Global Reach",
      description: "Access our platform from anywhere, anytime to enhance your language skills."
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Transforming Language Learning</h1>
          <p className="text-xl text-blue-100">
            Making language acquisition interactive, engaging, and accessible for everyone
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We&apos;re dedicated to breaking down language barriers through innovative learning solutions.
            Our platform combines modern technology with proven educational methods to create an
            engaging and effective learning experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;