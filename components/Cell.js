import React from 'react';
import marked from 'marked';
import Highlight from 'react-highlight';

export default ({ cell: { type, data, language } }) => {
    let Cell = (
        <div className="text">
            <Highlight innerHTML>
                {data}
            </Highlight>
        </div>
    );

    if (type === 'markdown') {
        Cell = (
            <div className="markdown">
                <Highlight innerHTML>
                    {marked(data)}
                </Highlight>
            </div>
        );
    } else if (type === 'code') {
        Cell = (
            <Highlight className={language}>
                {data}
            </Highlight>
        );
    }

    return Cell;
}