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
}

export function CharityGraph({ nodes, links, onNodeClick }: CharityGraphProps) {
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
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create container for zoomable content
    const container = svg.append("g");

    // Create the simulation with more spacing
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(300))
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

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
      .attr("fill", "#666");

    // Create the links with arrows and values
    const linkGroup = container.append("g")
      .selectAll("g")
      .data(links)
      .join("g");

    linkGroup.append("path")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    linkGroup.append("text")
      .attr("dy", -5)
      .attr("fill", "#666")
      .attr("font-size", "10px")
      .text((d: any) => formatCurrency(d.value));

    // Create the nodes
    const nodeGroup = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
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
        switch (d.type) {
          case 'high':
            return 'rgba(255, 68, 68, 0.1)';
          case 'medium':
            return 'rgba(255, 187, 51, 0.1)';
          default:
            return 'rgba(153, 153, 153, 0.1)';
        }
      })
      .attr("stroke", (d: CharityNode) => {
        switch (d.type) {
          case 'high':
            return '#ff4444';
          case 'medium':
            return '#ffbb33';
          default:
            return '#999999';
        }
      })
      .attr("stroke-width", 1);

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

    // Add click handler
    nodeGroup.on("click", (event: MouseEvent, d: CharityNode) => {
      if (onNodeClick) onNodeClick(d);
    });

    // Update positions on each tick
    simulation.on("tick", () => {
      linkGroup.select("path").attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      linkGroup.select("text").attr("transform", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        return `translate(${midX},${midY}) rotate(${angle})`;
      });

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
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
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onNodeClick]);

  return (
    <div className="w-full h-full bg-[#0f1117]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
} 