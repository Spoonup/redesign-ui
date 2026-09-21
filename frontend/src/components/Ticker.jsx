import React from 'react';

const tickerItems = [
  'Free delivery above <i>₹499</i>',
  'No refined sugar. Ever.',
  'Kashmir ke dry fruits, <i>100% pure</i>',
  'Pickup from Main Shop',
  'Small indulgences, big impact',
  'Made fresh, with care'
];

export const Ticker = () => {
  const fullList = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {fullList.map((item, index) => (
          <React.Fragment key={index}>
            <span dangerouslySetInnerHTML={{ __html: item }} />
            <span>
              <i>✦</i>
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
