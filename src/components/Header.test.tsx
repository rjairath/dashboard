import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { ThemeContext } from './ThemeProvider';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
		};
	},
	usePathname() {
		return '/';
	},
}));

// Mock the API calls
jest.mock('@/lib/api', () => ({
	postAnalytics: jest.fn(),
}));

// Mock the utils
jest.mock('@/utils', () => ({
	getDate: jest.fn(() => '2025-07-13'),
}));

describe('Header Component', () => {
	const mockHeaderComponent = (
		<ThemeContext.Provider
			value={{ theme: 'light', toggleTheme: jest.fn() }}
		>
			<Header />
		</ThemeContext.Provider>
	);

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
	});

	test('renders the header component', () => {
		render(<Header />);

		// Check if the header container exists
		const headerElement = document.querySelector('#header');
		expect(headerElement).toBeInTheDocument();
	});
});
