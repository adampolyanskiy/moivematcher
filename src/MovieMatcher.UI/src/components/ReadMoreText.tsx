import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

interface ReadMoreTextProps {
    text: string;
    amountOfWords?: number;
}

export const ReadMoreText: React.FC<ReadMoreTextProps> = ({ text, amountOfWords = 36 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const splittedText = text.split(' ');
    const itCanOverflow = splittedText.length > amountOfWords;
    const beginText = itCanOverflow ? splittedText.slice(0, amountOfWords - 1).join(' ') : text;
    const endText = splittedText.slice(amountOfWords - 1).join(' ');

    useEffect(() => {
        setIsExpanded(false);
    }, [text]);

    const handleKeyboard = (e: React.KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {beginText}
                {itCanOverflow && (
                    <>
                        {!isExpanded && <span className="text-gray-500">... </span>}
                        <span className={`${!isExpanded && 'hidden'}`} aria-hidden={!isExpanded}>
                            {endText}
                        </span>
                    </>
                )}
            </p>
            {itCanOverflow && ( // Moved button outside of the <p>
                <Button
                    variant="link"
                    className="text-blue-500 hover:underline p-0"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={handleKeyboard}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </Button>
            )}
        </>
    );
};