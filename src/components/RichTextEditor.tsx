import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter rich description...',
  minHeight = '150px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync incoming value to contentEditable div if content differs
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const handleOpenLinkDialog = () => {
    saveSelection();
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  const handleApplyLink = () => {
    setShowLinkDialog(false);
    restoreSelection();
    if (linkUrl.trim()) {
      executeCommand('createLink', linkUrl.trim());
    }
  };

  const handleRemoveLink = () => {
    executeCommand('unlink');
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-800/20 focus-within:border-amber-800 bg-white transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-1.5 bg-slate-50 border-b border-slate-200 text-slate-700 select-none">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          title="Heading 3"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h4>')}
          title="Heading 4"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Heading4 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          title="Normal Text (Paragraph)"
          className="px-1.5 py-1 rounded-lg hover:bg-slate-200 hover:text-slate-900 text-[11px] font-bold transition-colors"
        >
          ¶
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          title="Underline (Ctrl+U)"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          title="Strikethrough"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          title="Quote Block"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={handleOpenLinkDialog}
          title="Insert Link"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleRemoveLink}
          title="Remove Link"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Unlink className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Clean formatting */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          title="Clear Formatting"
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Link Input Overlay Modal */}
      {showLinkDialog && (
        <div className="p-2.5 bg-amber-50/80 border-b border-amber-200 flex items-center gap-2">
          <input
            type="url"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyLink();
              } else if (e.key === 'Escape') {
                setShowLinkDialog(false);
              }
            }}
            placeholder="Enter web link URL (e.g. https://...)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-800"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Insert Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkDialog(false)}
            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-3.5 text-sm text-slate-800 focus:outline-hidden leading-relaxed prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
      />
    </div>
  );
}

