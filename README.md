# Aaltoes ChatBot

A ChatBot utilizing the ChatGPT API to provide generic assistance, designed specifically for Aaltoes. This project features a user-friendly administrative panel to manage roles and quotas, with an intuitive interface inspired by ChatGPT's design.

## Features

- Authorization with Google.
- Responses are streamed and rendered in memoized markdown.
- Ability to select different AI models (OpenAI, Claude, DeepSeek) which affect how quotas are counted.
- Autoscroll functionality.
- Ability to reload/stop responses.
- Admin panel for role management.
- Quota system managed via email requests.
- Dark theme for better usability in low-light conditions.
- Dynamic topic generation based on chat history.
- Chats categorized by date: Today, Yesterday, Last 7 Days.
- Banning system with immediate effects on user rights and quotas.
- Responsive design, optimized for mobile and desktop devices.

## Installation

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/aaltoes/aaltoes-chatbot.git
   ```
2. Navigate to the project folder:
   ```bash
   cd aaltoes-chatbot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - You can use the provided `.env.example` file as a template:
     ```bash
     cp .env.example .env
     ```
   - Add the following environment variables:
     ```
     NEXTAUTH_SECRET=your_secret_here
     GOOGLE_CLIENT_ID=your_google_client_id_here
     GOOGLE_CLIENT_SECRET=your_google_client_secret_here
     OPENAI_API_KEY=your_openai_api_key_here
     ANTHROPIC_API_KEY=your_anthropic_api_key_here
     DATABASE_URL=your_database_url_here
     DEEPSEEK_API_KEY=your_deepseek_api_key_here
     ```
   Ensure you replace `your_secret_here`, `your_google_client_id_here`, `your_google_client_secret_here`, `your_openai_api_key_here`, `your_anthropic_api_key_here`, `your_database_url_here`, and `your_deepseek_api_key_here` with your actual credentials.

5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser to access the chatbot.

## Contributing

Contributions are welcome! Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on how you can contribute to the Aaltoes ChatBot project.

## Code of Conduct

This project and everyone participating in it is governed by the [Aaltoes Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Issues & Support

Encounter a bug or have a feature request? Please file it in the [GitHub Issues](https://github.com/aaltoes/aaltoes-chatbot/issues) section. For support or general inquiries, use our [Discussions](https://github.com/aaltoes/aaltoes-chatbot/discussions) page.

## Acknowledgments

Developed and maintained by Aaltoes. Special thanks to contributors [@kankeinai](https://github.com/kankeinai) and [@yerzham](https://github.com/yerzham) for their dedication and hard work.

## Community & Contact

Connect with us:
- **Website:** [aaltoes.com](https://aaltoes.com)
- **Telegram:** [Join Aaltoes Community](https://t.me/+lcMtXV1EAr9mYzIy)
- **Email:** [board@aaltoes.com](mailto:board@aaltoes.com)
