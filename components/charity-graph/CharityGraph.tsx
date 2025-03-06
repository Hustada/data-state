"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

interface CharityGraphProps {
  nodes: CharityNode[];
  links: CharityLink[];
  onNodeClick?: (node: CharityNode) => void;
  selectedNodeId?: string | null;
  connectedNodes?: Set<string>;
}

export function CharityGraph({ nodes, links, onNodeClick, selectedNodeId, connectedNodes }: CharityGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.getBoundingClientRect().width ?? 800;
    const height = svg.node()?.getBoundingClientRect().height ?? 600;

    // Clear existing content
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 2])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create container for zoomable content
    const container = svg.append("g");

    // Position nodes in a fixed grid
    const nodeSpacingX = 350; // Slightly reduced horizontal spacing
    const nodeSpacingY = 250; // Slightly reduced vertical spacing
    const cols = 4; // Increased to 4 columns for better horizontal spread
    const rows = Math.ceil(nodes.length / cols); // Will be around 6 rows

    // Calculate total grid size
    const gridWidth = nodeSpacingX * (cols - 1);
    const gridHeight = nodeSpacingY * (rows - 1);

    // Calculate starting position to center the grid
    const startX = (width - gridWidth) / 2;
    const startY = (height - gridHeight) / 2;

    // Calculate positions
    nodes.forEach((node: any, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      node.x = startX + col * nodeSpacingX;
      node.y = startY + row * nodeSpacingY;
      // Fix positions permanently
      node.fx = node.x;
      node.fy = node.y;
    });

    // Set initial zoom to fit all content
    const scale = 0.5; // Reduced initial zoom to show more content
    const centerX = width / 2;
    const centerY = height / 2;
    svg.call(zoom.transform as any, d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(scale)
      .translate(-centerX, -centerY));

    // Create a minimal simulation just for the links
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .alphaDecay(0.1);

    // Create arrow marker for links
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -10 20 20")
      .attr("refX", 35)
      .attr("refY", 0)
      .attr("markerWidth", 20)
      .attr("markerHeight", 20)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M-6.75,-6.75 L 0,0 L -6.75,6.75")
      .attr("fill", "#94a3b8");

    // Create the links with arrows and values
    const linkGroup = container.append("g")
      .selectAll("g")
      .data(links)
      .join("g");

    linkGroup.append("path")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", (d: any) => {
        if (!selectedNodeId) return 0.4;
        return (d.source.id === selectedNodeId || d.target.id === selectedNodeId) ? 0.8 : 0.1;
      })
      .attr("stroke-width", (d: any) => {
        if (!selectedNodeId) return 1.5;
        return (d.source.id === selectedNodeId || d.target.id === selectedNodeId) ? 2.5 : 1;
      })
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    linkGroup.append("text")
      .attr("dy", -5)
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .attr("opacity", (d: any) => {
        if (!selectedNodeId) return 0.8;
        return (d.source.id === selectedNodeId || d.target.id === selectedNodeId) ? 1 : 0.1;
      })
      .text((d: any) => formatCurrency(d.value));

    // Create the nodes
    const nodeGroup = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add rectangles (cards) to nodes
    nodeGroup.append("rect")
      .attr("width", 260)
      .attr("height", 150)
      .attr("x", -130)
      .attr("y", -75)
      .attr("rx", 5)
      .attr("fill", (d: CharityNode) => {
        const isSelected = d.id === selectedNodeId;
        const isConnected = connectedNodes?.has(d.id);
        const opacity = !selectedNodeId || isSelected || isConnected ? 0.1 : 0.02;
        
        switch (d.type) {
          case 'high':
            return `rgba(255, 68, 68, ${opacity})`;
          case 'medium':
            return `rgba(255, 187, 51, ${opacity})`;
          default:
            return `rgba(153, 153, 153, ${opacity})`;
        }
      })
      .attr("stroke", (d: CharityNode) => {
        const isSelected = d.id === selectedNodeId;
        const isConnected = connectedNodes?.has(d.id);
        
        switch (d.type) {
          case 'high':
            return isSelected ? '#ff6666' : '#ff4444';
          case 'medium':
            return isSelected ? '#ffcc66' : '#ffbb33';
          default:
            return isSelected ? '#bbbbbb' : '#999999';
        }
      })
      .attr("stroke-width", (d: CharityNode) => {
        const isSelected = d.id === selectedNodeId;
        const isConnected = connectedNodes?.has(d.id);
        return isSelected ? 2 : 1;
      })
      .attr("stroke-opacity", (d: CharityNode) => {
        const isSelected = d.id === selectedNodeId;
        const isConnected = connectedNodes?.has(d.id);
        return !selectedNodeId || isSelected || isConnected ? 1 : 0.3;
      });

    // Add "High Taxpayer Funds Alert" banner for high type
    const alertGroup = nodeGroup.filter((d: CharityNode) => d.type === 'high')
      .append("g");

    alertGroup.append("rect")
      .attr("width", 260)
      .attr("height", 24)
      .attr("x", -130)
      .attr("y", -75)
      .attr("fill", "rgba(255, 68, 68, 0.1)")
      .attr("stroke", "none");

    alertGroup.append("text")
      .text("⚠️ High Taxpayer Funds")
      .attr("x", -120)
      .attr("y", -60)
      .attr("fill", "#ff4444")
      .attr("font-size", "11px")
      .attr("font-weight", "bold");

    // Add text content to nodes
    const textGroup = nodeGroup.append("g")
      .attr("transform", (d: CharityNode) => 
        d.type === 'high' 
          ? "translate(-120, -35)"
          : "translate(-120, -45)"
      );

    // Organization name (with text wrapping)
    const nameText = textGroup.append("text")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    // Split organization name into multiple lines if needed
    nameText.each(function(d: CharityNode) {
      const text = d3.select(this);
      const words = d.name.split(/\s+/);
      let line = '';
      let lineNumber = 0;
      const lineHeight = 14;
      
      words.forEach(word => {
        const testLine = line + word + " ";
        if (testLine.length > 30) {
          text.append("tspan")
            .attr("x", 0)
            .attr("y", lineNumber * lineHeight)
            .text(line.trim());
          line = word + " ";
          lineNumber++;
        } else {
          line = testLine;
        }
      });
      text.append("tspan")
        .attr("x", 0)
        .attr("y", lineNumber * lineHeight)
        .text(line.trim());
    });

    // EIN
    textGroup.append("text")
      .text((d: CharityNode) => `EIN: ${d.ein}`)
      .attr("y", 30)
      .attr("fill", "#999")
      .attr("font-size", "10px");

    // Financial info
    const formatValue = (value: number) => {
      if (value >= 1000000) {
        const valueInM = value / 1000000;
        return `$${valueInM.toFixed(valueInM % 1 === 0 ? 0 : 1)}M`;
      }
      return formatCurrency(value);
    };

    // Add financial info with more spacing
    const financialGroup = textGroup.append("g")
      .attr("transform", "translate(0, 45)");

    financialGroup.append("text")
      .text((d: CharityNode) => `Gross receipts: ${formatValue(d.grossReceipts)}`)
      .attr("y", 0)
      .attr("fill", "#fff")
      .attr("font-size", "11px");

    financialGroup.append("text")
      .text((d: CharityNode) => `Contributions: ${formatValue(d.contributions)}`)
      .attr("y", 20)
      .attr("fill", "#fff")
      .attr("font-size", "11px");

    financialGroup.append("text")
      .text((d: CharityNode) => `Grants given: ${formatValue(d.grantsGiven)}`)
      .attr("y", 40)
      .attr("fill", "#fff")
      .attr("font-size", "11px");

    financialGroup.append("text")
      .text((d: CharityNode) => `Taxpayer funds: ${formatValue(d.taxpayerFunds)}`)
      .attr("y", 60)
      .attr("fill", (d: CharityNode) => d.type === 'high' ? '#ff4444' : '#fff')
      .attr("font-size", "11px")
      .attr("font-weight", (d: CharityNode) => d.type === 'high' ? "bold" : "normal");

    // Update text opacity based on selection
    nodeGroup.selectAll("text")
      .attr("opacity", (d: any) => {
        const isSelected = d.id === selectedNodeId;
        const isConnected = connectedNodes?.has(d.id);
        return !selectedNodeId || isSelected || isConnected ? 1 : 0.3;
      });

    // Modified drag functions to maintain some position stability
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep position fixed for a short time after drag
      setTimeout(() => {
        event.subject.fx = null;
        event.subject.fy = null;
      }, 1000);
    }

    // Update positions
    nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Update link positions with curved paths
    linkGroup.select("path").attr("d", (d: any) => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    });

    // Update link label positions
    linkGroup.select("text").attr("transform", (d: any) => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const midX = (d.source.x + d.target.x) / 2;
      const midY = (d.source.y + d.target.y) / 2;
      return `translate(${midX},${midY}) rotate(${angle})`;
    });

    // Add click handler
    nodeGroup.on("click", (event: MouseEvent, d: CharityNode) => {
      if (onNodeClick) onNodeClick(d);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onNodeClick, selectedNodeId, connectedNodes]);

  return (
    <div className="w-full h-full bg-[#1f2937]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '1000px' }}
      />
    </div>
  );
} 