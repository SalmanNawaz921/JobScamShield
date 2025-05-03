// components/BotResponse.jsx

const BotResponse = ({ responseData }) => {
    return (
      <div className="space-y-4">
        {responseData.map((item, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              item.isCritical 
                ? 'bg-red-50 border-l-4 border-red-500' 
                : 'bg-blue-50 border-l-4 border-blue-500'
            }`}
          >
            <div className="font-medium">
              {item.type === 'summary' && 'Summary:'}
              {item.type === 'score' && 'Risk Score:'}
              {item.type === 'warning' && 'Warning:'}
              {item.type === 'advice' && 'Advice:'}
            </div>
            <div>{item.content}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default BotResponse;