import React, { useState, useEffect } from 'react';

type Props = {
  apiKey: string,
}

const StreamTextCompletion: React.FC<Props> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  // Explicitly specify the type as string[]
  const [streamData, setStreamData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear stream data when prompt is cleared
    if (!prompt) {
      setStreamData([]);
    }
  }, [prompt]);

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setStreamData([]); // Clear previous stream data

    try {
      const responseStream = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          model: 'gpt-3.5-turbo', // or your specific model
          prompt,
          system: 'Your system message if any'
        }),
      });

      if (responseStream.body) {
        const reader = responseStream.body.getReader();
        let decoder = new TextDecoder();

        // Adjust the processText function to correctly handle the argument type
        const processText = async (result: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
          const { done, value } = result;
          if (done) {
            console.log("Stream complete");
            setIsLoading(false);
            return;
          }
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setStreamData(prevData => [...prevData, chunk]);
          }
          return reader.read().then(processText);
        };

        reader.read().then(processText);
      } else {
        console.error('Response body is null');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="stream-text-completion">
      <div className="input-area">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt"
          className="prompt-input"
        />
        <hr className='input-submit-spacer' />
        <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
      <div className="stream-output">
        {streamData.map((data, index) => (
          <div key={index} className="stream-data">
            {data}
          </div>
        ))}
      </div>

      <style jsx>{`
        .input-submit-spacer {
          margin: 10px;
        }

        .stream-text-completion .input-area {
          margin-bottom: 20px;
        }

        .stream-text-completion .prompt-input {
          color: black;
          width: 80%;
          padding: 10px;
          margin-right: 10px;
        }

        .stream-text-completion .submit-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .stream-text-completion .submit-button[disabled] {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .stream-text-completion .stream-output {
          color:black;
          padding: 20px;
          border: 1px solid #ccc;
          height: 300px;
          overflow-y: auto;
        }

        .stream-text-completion .stream-data {
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f8f8f8;
          border: 1px solid #eee;
        }
      `}</style>
    </div>
  );
};

export default StreamTextCompletion;
