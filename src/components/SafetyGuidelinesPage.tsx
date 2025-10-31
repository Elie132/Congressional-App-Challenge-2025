interface SafetyGuidelinesPageProps {
  setCurrentPage: (page: string) => void;
}

export function SafetyGuidelinesPage({ setCurrentPage }: SafetyGuidelinesPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛡️ Food Guidelines & Safety
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Ensuring safe food sharing for everyone in our community. Please read these guidelines carefully before donating or receiving food.
        </p>
      </div>

      {/* Quick Safety Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-800 mb-3">🚨 Quick Safety Reminders</h2>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-green-700">
          <div className="flex items-center">
            <span className="mr-2">❄️</span>
            Keep cold foods cold (below 40°F)
          </div>
          <div className="flex items-center">
            <span className="mr-2">⏰</span>
            Follow the 2-hour rule for perishables
          </div>
          <div className="flex items-center">
            <span className="mr-2">🧼</span>
            Wash your hands before handling food
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* For Donors Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🤝</span>
            <h2 className="text-2xl font-bold text-gray-900">For Food Donors</h2>
          </div>

          <div className="space-y-6">
            {/* What Can Be Shared */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Safe Foods to Share</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Prepared Foods</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Freshly cooked meals (within 2 hours)</li>
                    <li>• Properly refrigerated leftovers (within 3-4 days)</li>
                    <li>• Baked goods (within 1-2 days)</li>
                    <li>• Soups and stews (properly cooled and stored)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Packaged & Fresh Items</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Unopened packaged foods (check expiration)</li>
                    <li>• Fresh produce (inspect for quality)</li>
                    <li>• Sealed beverages</li>
                    <li>• Frozen items (if transport is quick)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What NOT to Share */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">❌ Foods NOT to Share</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Foods left at room temperature for over 2 hours (1 hour if over 90°F)</li>
                  <li>• Expired or spoiled items</li>
                  <li>• Foods with unknown ingredients (allergen concerns)</li>
                  <li>• Home-canned goods (botulism risk)</li>
                  <li>• Raw or undercooked meat, poultry, eggs, or seafood</li>
                  <li>• Foods that have been partially consumed</li>
                  <li>• Items stored in damaged or compromised packaging</li>
                </ul>
              </div>
            </div>

            {/* Storage Guidelines */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🧊 Safe Storage & Transport</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">Before Pickup</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Keep cold foods refrigerated until pickup</li>
                    <li>• Cool hot foods completely before storing</li>
                    <li>• Use clean, food-safe containers</li>
                    <li>• Label with contents and preparation date</li>
                    <li>• Include reheating instructions if needed</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">During Handoff</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Use insulated bags for cold items</li>
                    <li>• Complete transfer quickly (within 30 minutes)</li>
                    <li>• Provide ice packs for cold items if needed</li>
                    <li>• Communicate any allergen information</li>
                    <li>• Ensure clean hands and surfaces</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Receivers Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🍽️</span>
            <h2 className="text-2xl font-bold text-gray-900">For Food Receivers</h2>
          </div>

          <div className="space-y-6">
            {/* Inspection Guidelines */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔍 Food Inspection Checklist</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Visual Inspection</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>✓ Check for mold, discoloration, or unusual appearance</li>
                      <li>✓ Ensure packaging is intact and clean</li>
                      <li>✓ Look for expiration dates on packaged items</li>
                      <li>✓ Verify food looks fresh and appetizing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Smell & Temperature</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>✓ Smell should be normal (no sour or off odors)</li>
                      <li>✓ Cold foods should feel cold to touch</li>
                      <li>✓ Food should not feel warm unless just cooked</li>
                      <li>✓ Trust your instincts - when in doubt, don't consume</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Handling */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🧤 Safe Handling Practices</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚚</div>
                    <h4 className="font-medium text-gray-800 mb-1">During Pickup</h4>
                    <p className="text-xs text-gray-600">Bring insulated bags, complete transfer quickly, maintain cold chain</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🏠</div>
                    <h4 className="font-medium text-gray-800 mb-1">At Home</h4>
                    <p className="text-xs text-gray-600">Refrigerate immediately, reheat to 165°F if needed, consume within safe timeframes</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🍴</div>
                    <h4 className="font-medium text-gray-800 mb-1">Before Eating</h4>
                    <p className="text-xs text-gray-600">Wash hands, reheat to 165°F, check for spoilage signs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* When to Discard */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🗑️ When to Discard Food</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3 font-medium">If ANY of these conditions are present, do not consume the food:</p>
                <ul className="text-sm text-yellow-700 space-y-1 grid md:grid-cols-2 gap-2">
                  <li>• Unusual smell, taste, or appearance</li>
                  <li>• Food has been at room temperature too long</li>
                  <li>• Packaging is damaged or compromised</li>
                  <li>• You're unsure about ingredients (allergies)</li>
                  <li>• Cold food feels warm or room temperature</li>
                  <li>• Any signs of mold or spoilage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">⚖️</span>
            <h2 className="text-2xl font-bold text-gray-900">Legal Disclaimer & Liability</h2>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Good Samaritan Food Donation Act Protection</h3>
              <p className="mb-3">
                Under the Bill Emerson Good Samaritan Food Donation Act, food donors are generally protected from liability when donating food in good faith to nonprofit organizations. However, this protection may not extend to peer-to-peer food sharing.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3 mt-6">User Responsibility</h3>
              <div className="space-y-2">
                <p><strong>Donors:</strong> You are responsible for ensuring food safety, proper storage, and accurate representation of donated items. Only share food you would feel comfortable eating yourself.</p>
                <p><strong>Receivers:</strong> You accept food at your own risk. Inspect all items carefully and use your best judgment about food safety before consumption.</p>
              </div>

              <h3 className="font-semibold text-gray-800 mb-3 mt-6">Platform Disclaimer</h3>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                ShelfShare is a platform that facilitates connections between food donors and receivers. We do not inspect, verify, or guarantee the safety or quality of any food shared through our platform. Users participate at their own risk and are solely responsible for food safety practices. ShelfShare disclaims all liability for any illness, injury, or damages resulting from food shared through our platform. By using this service, you acknowledge and accept these terms.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Emergency & Health Concerns</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-red-700 mb-2">If You Suspect Food Poisoning:</h4>
              <ul className="text-red-600 space-y-1">
                <li>• Seek medical attention if symptoms are severe</li>
                <li>• Contact your local health department</li>
                <li>• Report the incident through our platform</li>
                <li>• Preserve any remaining food for testing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-700 mb-2">Emergency Contacts:</h4>
              <ul className="text-red-600 space-y-1">
                <li>• Emergency: 911</li>
                <li>• Poison Control: 1-800-222-1222</li>
                <li>• Local Health Dept: Contact your city/county</li>
                <li>• Platform Support: [Contact form in app]</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Back Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => setCurrentPage("home")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}