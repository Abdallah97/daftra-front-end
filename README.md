# Navigation Customizer

A Next.js application that allows users to customize their navigation menu by reordering items, toggling visibility, and editing titles.

## Features

- Drag and drop functionality for reordering navigation items
- Toggle visibility of navigation items
- Edit navigation item titles
- Save or discard changes
- Analytics tracking for navigation changes
- Responsive design for both desktop and mobile

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=https://daftra-backend.vercel.app
```

This sets the base URL for the API. The default is `https://daftra-backend.vercel.app` if not specified.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application uses the following API endpoints:

- `GET /nav` - Fetch navigation items
- `POST /nav` - Save navigation items
- `POST /track` - Track navigation changes

## Technologies Used

- Next.js
- React
- Material-UI
- React DnD (Drag and Drop)
- Axios
- TypeScript

## License

This project is licensed under the MIT License.
