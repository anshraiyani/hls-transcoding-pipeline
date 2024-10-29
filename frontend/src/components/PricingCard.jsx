/* eslint-disable react/prop-types */
const PricingCard = ({ title, price, features }) => (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
        <h3 className="text-2xl font-light text-gray-100 mb-2">{title}</h3>
        <p className="text-3xl font-light text-gray-100 mb-4">{price}</p>
        <ul className="text-gray-400 space-y-2 font-light">
            {features.map((feature, index) => (
                <li key={index}>{feature}</li>
            ))}
        </ul>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-gray-100 rounded-full font-light hover:bg-blue-700 transition-colors">
            Choose Plan
        </button>
    </div>
);

export default PricingCard