const Privacy = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-700">Personal Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We may collect personal identification information including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Name and email address</li>
                <li>Billing and shipping information</li>
                <li>Phone number</li>
                <li>Device and browser information</li>
              </ul>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              Our service may contain links to other sites that are not operated by us. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information. You can exercise these rights by contacting us through the contact information provided on our website.
            </p>
          </section>
        </div>
      </div>
    );
  };

  export default Privacy