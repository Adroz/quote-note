"use client";

import { useState, useRef, useEffect } from "react";
import { useQuotes } from "@/contexts/QuoteContext";

interface AddQuoteFormProps {
  initialOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isShowcase?: boolean;
}

export const AddQuoteForm = ({ initialOpen = false, onOpenChange, isShowcase = false }: AddQuoteFormProps) => {
  const { addQuote, store } = useQuotes();
  const [text, setText] = useState(isShowcase ? "The best preparation for tomorrow is doing your best today." : "");
  const [author, setAuthor] = useState(isShowcase ? "H. Jackson Brown Jr." : "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(isShowcase ? ["inspiration", "🌟"] : []);
  const [isOpen, setIsOpen] = useState(initialOpen || isShowcase);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Effect to sync isOpen state with the initialOpen prop
  useEffect(() => {
    if (!isShowcase) {
      setIsOpen(initialOpen);
    }
  }, [initialOpen, isShowcase]);

  // Effect to notify parent component when isOpen changes
  useEffect(() => {
    if (!isShowcase) {
      onOpenChange?.(isOpen);
    }
  }, [isOpen, onOpenChange, isShowcase]);

  // Count usage of each tag and sort suggestions by usage count, then alphabetically
  const tagSuggestions = store.tags
    .filter(tag => 
      !tags.includes(tag) && // Don't show tags already added
      (
        tagInput.trim() === "" || // Show all tags when input is empty
        tag.toLowerCase().includes(tagInput.toLowerCase()) // Filter as user types
      )
    )
    .sort((a, b) => {
      // Count occurrences of each tag
      const countA = store.quotes.filter(quote => quote.tags.includes(a)).length;
      const countB = store.quotes.filter(quote => quote.tags.includes(b)).length;
      
      // Sort by count (descending)
      if (countB !== countA) {
        return countB - countA;
      }
      
      // If counts are equal, sort alphabetically
      return a.localeCompare(b);
    });

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setShowTagSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSelectSuggestion = (tag: string) => {
    setTags([...tags, tag]);
    setTagInput("");
    setShowTagSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation for tag suggestions
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (tagSuggestions.length > 0 && showTagSuggestions) {
      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < tagSuggestions.length - 1 ? prev + 1 : prev
        );
      }
      // Arrow up
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
      }
      // Enter to select suggestion
      else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(tagSuggestions[selectedSuggestionIndex]);
      }
      // Enter to add new tag when no suggestion is selected
      else if (e.key === 'Enter' && selectedSuggestionIndex === -1 && tagInput) {
        e.preventDefault();
        handleAddTag();
      }
      // Escape to close suggestions
      else if (e.key === 'Escape') {
        setShowTagSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowTagSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Function to remove quotation marks from beginning and end of text
  const removeQuotationMarks = (text: string): string => {
    let trimmed = text.trim();
    
    // Remove leading quotation mark if present
    if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
      trimmed = trimmed.substring(1);
    }
    
    // Remove trailing quotation mark if present
    if (trimmed.endsWith('"') || trimmed.endsWith("'")) {
      trimmed = trimmed.substring(0, trimmed.length - 1);
    }
    
    return trimmed.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't actually submit in showcase mode
    if (isShowcase) {
      setIsOpen(false);
      return;
    }
    
    if (!text.trim()) return;

    // Process the text to remove quotation marks
    const processedText = removeQuotationMarks(text);

    addQuote({
      text: processedText,
      author: author.trim() || undefined,
      tags
    });

    // Reset form
    setText("");
    setAuthor("");
    setTags([]);
    setIsOpen(false);
  };

  // Don't render the floating add button in showcase mode
  if (isShowcase) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add a new quote</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="quote-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quote text (required)
            </label>
            <textarea
              id="quote-text"
              value={text}
              readOnly={isShowcase}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              rows={4}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="quote-author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author (optional)
            </label>
            <input
              type="text"
              id="quote-author"
              value={author}
              readOnly={isShowcase}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quote-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex relative">
              <input
                ref={inputRef}
                type="text"
                id="quote-tags"
                placeholder="Add a tag"
                readOnly={isShowcase}
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <button
                type="button"
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center"
                >
                  {tag}
                  {!isShowcase && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Quote
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Add quote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add a new quote</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="quote-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quote text (required)
                </label>
                <textarea
                  id="quote-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  rows={4}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="quote-author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author (optional)
                </label>
                <input
                  type="text"
                  id="quote-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="quote-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex relative">
                  <input
                    ref={inputRef}
                    type="text"
                    id="quote-tags"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onFocus={() => {
                      setShowTagSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                  
                  {/* Tag suggestions dropdown */}
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div 
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto"
                    >
                      {tagSuggestions.map((tag, index) => (
                        <div
                          key={tag}
                          onClick={() => handleSelectSuggestion(tag)}
                          className={`px-3 py-2 cursor-pointer ${
                            index === selectedSuggestionIndex
                              ? 'bg-indigo-100 dark:bg-indigo-900'
                              : 'hover:bg-gray-100 dark:hover:bg-slate-600'
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!text.trim()}
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}; 