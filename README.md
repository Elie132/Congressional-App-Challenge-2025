# ShelfShare - Food Waste Reduction Platform

**Congressional App Challenge 2025 Submission**

ShelfShare is a web application designed to reduce food waste by connecting food donors (restaurants, grocery stores, individuals) with food receivers (food banks, shelters, community organizations). Our platform makes it easy to share surplus food before it goes to waste.

## 🌟 Features

- **Food Listing System**: Donors can easily list available food with photos, quantities, and pickup times
- **Smart Matching**: Receivers can browse and claim food based on location and category
- **Multi-Person Claims**: Multiple organizations can claim portions of large food donations
- **Real-Time Communication**: Built-in messaging system for coordination between donors and receivers
- **Food Safety Guidelines**: Comprehensive safety information to ensure proper food handling
- **Role Management**: Users can switch between donor and receiver roles as needed
- **Location-Based Search**: Find food donations by ZIP code
- **Category Filtering**: Filter by food type (prepared food, produce, packaged goods, baked goods)

## 🚀 Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Real-time database with TypeScript functions
- **Authentication**: Secure user authentication with multiple sign-in options
- **Image Storage**: Local image storage system for food photos
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── FeedPage.tsx          # Browse available food
│   │   ├── CreateListingPage.tsx # Create food listings
│   │   ├── DonorDashboard.tsx    # Donor management interface
│   │   ├── ReceiverDashboard.tsx # Receiver management interface
│   │   ├── ProfilePage.tsx       # User profile management
│   │   ├── SafetyGuidelinesPage.tsx # Food safety information
│   │   └── ...                   # Additional components
│   ├── utils/              # Utility functions
│   └── App.tsx            # Main application component
├── convex/                # Backend database functions
│   ├── schema.ts          # Database schema definitions
│   ├── listings.ts        # Food listing operations
│   ├── claims.ts          # Claim management
│   ├── users.ts           # User management
│   └── ...               # Additional backend functions
├── public/               # Static assets
└── package.json         # Project dependencies
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Elie132/Congressional-App-Challenge-2025.git
   cd Congressional-App-Challenge-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🎯 How It Works

### For Food Donors
1. **Sign Up**: Create an account and set up your donor profile
2. **List Food**: Add details about available food including photos, quantity, and pickup times
3. **Manage Requests**: Review and approve pickup requests from receivers
4. **Coordinate Pickup**: Use the built-in messaging system to coordinate with receivers
5. **Track Impact**: Monitor your food donations and their impact

### For Food Receivers
1. **Browse Food**: Search for available food by location and category
2. **Request Pickup**: Claim food items that match your organization's needs
3. **Specify Quantity**: Request partial quantities for large donations
4. **Coordinate**: Communicate with donors to arrange pickup details
5. **Follow Safety Guidelines**: Access food safety information to ensure proper handling

## 🔒 Safety & Security

- User authentication and secure data handling
- Comprehensive food safety guidelines
- Reporting system for inappropriate content
- Privacy protection for all users

## 🌍 Impact

ShelfShare addresses the critical issue of food waste while helping feed communities in need. By making food sharing simple and efficient, we're working to:

- Reduce the 80 billion pounds of food wasted annually in the US
- Connect surplus food with organizations that need it most
- Build stronger, more sustainable communities
- Promote environmental responsibility

## 📱 Screenshots

The application features a clean, intuitive interface designed for ease of use across all devices. Key screens include the food browsing interface, listing creation form, and dashboard management systems.

## 🤝 Contributing

This project was created for the Congressional App Challenge 2025. For questions or feedback, please open an issue in this repository.

## 📄 License

This project is open source and available under the MIT License.
