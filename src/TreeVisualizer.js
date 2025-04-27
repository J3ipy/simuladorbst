// src/TreeVisualizer.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function TreeVisualizer({ nodes = [] }) {
    const containerRef = useRef();
    const svgRef = useRef();
    const [dims, setDims] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function update() {
            if (!containerRef.current) return;
            const { width } = containerRef.current.getBoundingClientRect();
            setDims({ width, height: 500 }); // altura inicial fixa
        }
        window.addEventListener('resize', update);
        update();
        return () => window.removeEventListener('resize', update);
    }, []);

    useEffect(() => {
        if (!dims.width) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        if (nodes.length === 0) return;

        // 1) Construir hierarquia
        const map = new Map();
        nodes.forEach(d => map.set(d.value, { ...d, children: [] }));
        let rootData = null;
        nodes.forEach(d => {
            const item = map.get(d.value);
            if (d.parent === null) rootData = item;
            else map.get(d.parent)?.children.push(item);
        });

        const root = d3.hierarchy(rootData);

        // 2) Layout automático
        const treeLayout = d3.tree()
            .size([dims.width, 400]); // largura e profundidade da árvore

        treeLayout(root);
        root.y += 50; // desloca o root pra baixo


        // 3) Centralizar raiz na horizontal
        const xOffset = dims.width / 2 - root.x;
        root.descendants().forEach(d => {
            d.x += xOffset;
        });

        // 4) Desenhar com animação
        const g = svg.append('g');

        // Links (arestas)
        const linkGenerator = d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y);

        const link = g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('d', d => linkGenerator({ source: d.source, target: d.source }));

        link.transition()
            .duration(500)
            .attr('d', d => linkGenerator({ source: d.source, target: d.target }));

        // Nós (círculo + textos)
        const node = g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${root.x},${root.y})`);

        node.transition()
            .duration(500)
            .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', 25)
            .attr('fill', d =>
                d.data.isRoot
                    ? '#333'
                    : d.data.value < rootData.value
                        ? '#fdd835'
                        : '#ef5350'
            );

        node.append('text')
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', d => (d.data.isRoot ? '#fff' : '#000'))
            .style('font-size', '14px')
            .text(d => d.data.value);

        node.append('text')
            .attr('dy', 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .attr('fill', '#333')
            .text(d =>
                `${d.data.isRoot ? 'Raiz' : 'Filho'}, ` +
                `${d.children ? 'Interior' : 'Folha'}, nível ${d.depth}`
            );

        node.append('text')
            .attr('dy', 55)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .attr('fill', '#555')
            .text(d => `Pai: ${d.data.parent ?? '-'}`);

    }, [nodes, dims]);

    return (
        <div ref={containerRef} style={{ width: '100%', overflowX: 'auto', padding: '20px 0' }}>
            <svg ref={svgRef} width={dims.width} height={dims.height} />
        </div>
    );
}
