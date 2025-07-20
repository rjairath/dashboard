import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

// Paths
const ASSETS_DIR = path.join(process.cwd(), 'src/assets');
const OUTPUT_DIR = path.join(process.cwd(), 'src/components/Icons');

// Make sure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert kebab case (my-icon) to pascal case (MyIcon)
const toPascalCase = (str: string): string => {
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
};

// Process all SVG files in the assets directory
const processSvgs = (): void => {
	const files = fs.readdirSync(ASSETS_DIR);

	files.forEach((file) => {
		if (path.extname(file) === '.svg') {
			const filePath = path.join(ASSETS_DIR, file);
			const fileName = path.basename(file, '.svg');
			const componentName = toPascalCase(fileName) + 'Icon';
			const outputPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);

			try {
				// Read SVG file
				const svgContent = fs.readFileSync(filePath, 'utf8');

				// Parse SVG
				const root = parse(svgContent);
				const svg = root.querySelector('svg');

				// Remove className and set new props
				const attributes = svg?.attributes;
				delete attributes?.className;
				delete attributes?.width;
				delete attributes?.height;

				// Get inner HTML of SVG
				const innerHtml = svg?.innerHTML;

				// Create React component
				const componentContent = `
                    import { SVGProps } from 'react';

                    type ${componentName}Props = SVGProps<SVGSVGElement> & {
                        width?: number | string;
                        height?: number | string;
                        color?: string;
                    };

                    export const ${componentName} = ({ 
                        width = 24, 
                        height = 24,
                        color = 'currentColor',
                        ...props 
                    }: ${componentName}Props) => (
                        <svg
                            xmlns="${
								attributes?.xmlns ||
								'http://www.w3.org/2000/svg'
							}"
                            width={width}
                            height={height}
                            viewBox="${attributes?.viewBox || '0 0 24 24'}"
                            fill="${attributes?.fill || 'none'}"
                            stroke={color}
                            strokeWidth="${attributes?.strokeWidth || '2'}"
                            strokeLinecap="${
								attributes?.strokeLinecap || 'round'
							}"
                            strokeLinejoin="${
								attributes?.strokeLinejoin || 'round'
							}"
                            {...props}
                        >
                            ${innerHtml}
                        </svg>
                    );
                `;

				// Write component file
				fs.writeFileSync(outputPath, componentContent);
				console.log(`✅ Created component: ${componentName}`);
			} catch (error) {
				console.error(`❌ Error processing ${fileName}.svg:`, error);
			}
		}
	});
};

processSvgs();
console.log('SVG conversion complete!');
