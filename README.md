# Charity Graph Visualization

An interactive visualization tool for exploring relationships and financial flows between charitable organizations. Built with Next.js, D3.js, and Tailwind CSS.

Built by [The Victor Collective](https://victorcollective.com)

## Features

### Interactive Graph Visualization
- Dynamic charity network graph showing financial relationships between organizations
- Fixed-grid layout for optimal readability and stability
- Smooth zoom and pan functionality
- Curved connection paths with directional arrows and value labels
- Automatic centering and scaling for best viewport fit

### Smart Node Selection
- Click to select individual charity nodes
- Highlights direct connections to selected organization
- Dims unrelated nodes and connections for focus
- Maintains visibility of important information while de-emphasizing less relevant data

### Rich Data Display
- Detailed charity cards showing:
  - Organization name with smart text wrapping
  - EIN (Employer Identification Number)
  - Financial metrics:
    - Gross receipts
    - Contributions
    - Grants given
    - Taxpayer funds
- Visual categorization of organizations:
  - High taxpayer funds (>$10M) with warning indicator
  - Medium taxpayer funds ($1M-$10M)
  - Low/No taxpayer funds
- Smart number formatting (e.g., "$12.5M" for large values)

### Search & Filter
- Search by EIN number
- Keyword-based organization search
- Real-time results updating

### Export & Share
- Download graph as SVG
- Preserve styling and layout in exports
- High-quality output for presentations and reports

## Technical Implementation

### Core Technologies
- **Framework**: Next.js 14 with React
- **Visualization**: D3.js for graph rendering
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks for local state
- **Type Safety**: TypeScript for robust development

### Key Components
- `CharityGraph`: Main visualization component
- `CharitySearch`: Search interface component
- `CharityCard`: Detailed information display
- Custom UI components for consistent styling

### Data Structure
```typescript
interface CharityNode {
  id: string;
  name: string;
  ein: string;
  grossReceipts: number;
  contributions: number;
  grantsGiven: number;
  taxpayerFunds: number;
  type: 'high' | 'medium' | 'low';
}

interface CharityLink {
  source: string;
  target: string;
  value: number;
}
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Navigation
- **Pan**: Click and drag on empty space
- **Zoom**: Use mouse wheel or pinch gesture
- **Select Node**: Click on any charity card
- **View Details**: Selected charity information appears in side panel
- **Search**: Use the search bar for EIN or keyword search
- **Export**: Click "Download SVG" to save the current view

### Advanced Features
- **Connection Analysis**: Select a node to highlight its financial relationships
- **Fund Flow Visualization**: Follow the arrows to track money movement
- **Quick Insights**: Warning indicators for high taxpayer fund organizations

## Project Structure
```
/
├── app/                    # Next.js app directory
├── components/            
│   ├── charity-graph/     # Graph visualization components
│   ├── search/           # Search interface components
│   └── ui/               # Shared UI components
├── public/                # Static assets
└── types/                # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Copyright © 2024 The Victor Collective. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

For licensing inquiries, please contact:
Victor Hustad (victorhustad@victorcollective.com)

## Acknowledgments

- D3.js community for visualization tools and examples
- Next.js team for the excellent framework
- Tailwind CSS for the styling system
