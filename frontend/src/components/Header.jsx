const Header = () => (
    <header className="w-full py-4 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-gray-100 text-2xl font-light">StreamForge</div>
            <nav>
                <ul className="flex space-x-6">
                    <li>
                        <a
                            href="#features"
                            className="text-gray-300 hover:text-gray-100 transition-colors"
                        >
                            Features
                        </a>
                    </li>
                    <li>
                        <a
                            href="#pricing"
                            className="text-gray-300 hover:text-gray-100 transition-colors"
                        >
                            Pricing
                        </a>
                    </li>
                    <li>
                        <a
                            href="#about"
                            className="text-gray-300 hover:text-gray-100 transition-colors"
                        >
                            About
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
);

export default Header;
