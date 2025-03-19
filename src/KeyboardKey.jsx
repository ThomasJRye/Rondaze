import React from 'react';

const KeyboardKey = ({ keyName }) => {
    const keyStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        color: 'white',
        border: '1px solid #555',
        borderRadius: '4px',
        padding: '2px 8px',
        margin: '0 4px',
        minWidth: '24px',
        height: '24px',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
        boxShadow: '0 2px 0 #222',
        verticalAlign: 'middle'
    };

    // Map key names to display text
    const keyDisplayMap = {
        LEFT: '←',
        RIGHT: '→',
        UP: '↑',
        DOWN: '↓',
        SPACE: 'SPACE',
        ENTER: '⏎'
    };

    // Adjust style for longer key names
    const finalStyle = {
        ...keyStyle,
        ...(keyName === 'SPACE' && { minWidth: '60px' }),
        ...(keyName === 'ENTER' && { minWidth: '40px' })
    };

    return (
        <span style={finalStyle}>
            {keyDisplayMap[keyName] || keyName}
        </span>
    );
};

export default KeyboardKey; 