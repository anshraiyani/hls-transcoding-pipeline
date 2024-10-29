/* eslint-disable react/prop-types */
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
        <div className="text-blue-400 mb-4">{icon}</div>
        <h3 className="text-xl font-light text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-400 font-light">{description}</p>
    </div>
);

export default FeatureCard;
