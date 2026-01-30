# Add Vocabulary Feature Design

## Overview
This feature allows users to add new vocabulary/phrases with custom emojis, auto-translation, and category management.

## Key Components

### 1. **State Management**
```tsx
// In AACApp component
const [showAddVocab, setShowAddVocab] = useState(false);
const [customPhrases, setCustomPhrases] = useState<typeof PHRASES>([]);
const [newPhrase, setNewPhrase] = useState({
  text: '',           // Chinese text
  en: '',            // English text
  icon: '📝',        // Selected emoji
  category: '',      // Selected category
});
const [selectedInputLang, setSelectedInputLang] = useState<'zh' | 'en'>('zh');
```

### 2. **Common Emojis Presets**
```tsx
const COMMON_EMOJIS = [
  '😊', '❤️', '👋', '🙏', '🍔', '💧', '🏥', '😴', '🆘', '🛏️',
  '👜', '🏠', '🍎', '📍', '🚻', '🍽️', '👨‍⚕️', '💊', '📺', '🚪',
  '❄️', '🔥', '💡', '🥄', '🍴', '🍇', '🍊', '🍍', '🏢', '🌳',
  '☕', '🎓', '🎨', '⚽', '🎮', '🎵', '📚', '🏃', '🚗', '✈️'
];
```

### 3. **Translation Strategy**

#### Option A: Manual Input (Simplest)
- User types in one language
- User manually types translation
- No external API needed

#### Option B: Prompt-Based Helper (Recommended)
- User types Chinese → Show English input placeholder
- User types English → Show Chinese input placeholder
- Optional: Use browser's built-in suggestions

#### Option C: External API (Advanced)
- Use translation API (Google Translate, DeepL)
- Requires backend integration
- Auto-translates on input

### 4. **Form Structure**

```tsx
<AddVocabularyForm>
  ├─ Emoji Picker
  │  ├─ Quick select (common emojis)
  │  ├─ Custom emoji input
  │  └─ Preview
  ├─ Language Toggle (Chinese/English input first)
  ├─ Primary Language Input (Chinese or English)
  ├─ Secondary Language Input (Auto-suggestion)
  ├─ Category Selector
  │  ├─ Existing categories dropdown
  │  └─ Create new category option
  └─ Add Button
```

### 5. **Functions Needed**

#### A. Add Phrase Function
```tsx
const addCustomPhrase = (phrase: Phrase) => {
  const newId = Math.max(...PHRASES.map(p => p.id), ...customPhrases.map(p => p.id), 0) + 1;
  const newPhraseWithId = { ...phrase, id: newId };
  
  // Add to custom phrases
  setCustomPhrases([...customPhrases, newPhraseWithId]);
  
  // Save to localStorage
  localStorage.setItem('custom-phrases', JSON.stringify([...customPhrases, newPhraseWithId]));
  
  // Reset form
  resetForm();
};
```

#### B. Category Management
```tsx
const getUniqueCategories = () => {
  const phrasesPool = [...PHRASES, ...customPhrases];
  return Array.from(new Set(phrasesPool.map(p => p.category)));
};

const createNewCategory = (categoryName: string, icon: string) => {
  // Update CATEGORY_ICONS and CATEGORY_LABELS
  // Add to local state
};
```

#### C. Emoji Picker Component
```tsx
const EmojiPicker = ({ selectedEmoji, onSelect }) => {
  return (
    <div>
      {/* Quick emoji grid */}
      {/* Custom emoji input */}
      {/* Emoji preview */}
    </div>
  );
};
```

#### D. Input Validation
```tsx
const validatePhrase = (phrase: Phrase) => {
  const errors: string[] = [];
  if (!phrase.text.trim()) errors.push('Chinese text required');
  if (!phrase.en.trim()) errors.push('English text required');
  if (!phrase.icon) errors.push('Emoji required');
  if (!phrase.category) errors.push('Category required');
  return errors;
};
```

## Implementation Steps

1. **Create AddVocabularyPanel component**
   - Emoji selector with common presets
   - Language toggle for input order
   - Text input fields
   - Category dropdown with "new category" option
   - Validation and error messages

2. **Add to localStorage**
   - Store custom phrases separately
   - Load on app initialization
   - Merge with PHRASES for display

3. **Update UI**
   - Add "Add Vocabulary" button to menu
   - Show panel when button clicked
   - Display success message after adding

4. **Manage Combined Phrases**
   - Merge PHRASES + customPhrases for display
   - Update category filters dynamically
   - Support editing/deleting custom phrases

## Translation Approach Recommendation

**Use Option A (Manual)** initially:
- Simplest to implement
- No external dependencies
- User has full control
- Can add translation hint: "Please provide translation"

**Future Enhancement**: Add translation API integration

## UI Layout

```
┌─────────────────────────────────┐
│  ✕ Add New Vocabulary           │
├─────────────────────────────────┤
│                                 │
│  📝 Select Emoji:              │
│  [😊][❤️][👋][🙏][🍔]...      │
│  Custom: [────────────]         │
│  Preview: 😊                    │
│                                 │
│  ○ Chinese  ◉ English          │
│                                 │
│  Chinese: [輸入中文詞語────]     │
│  English: [Type English word─]  │
│                                 │
│  Category: [Select Category ▼]  │
│            [+ Create New    ]   │
│                                 │
│          [Add Vocabulary] [Cancel]│
│                                 │
└─────────────────────────────────┘
```

## Code Integration Points

1. **Add to state**: vocabulary panel toggle, form inputs
2. **Add to menu**: "Add Vocabulary" button
3. **Add helper functions**: validation, adding, category management
4. **Update phrase pool**: merge custom phrases with defaults
5. **LocalStorage**: persist custom phrases across sessions
6. **Update UI**: show custom phrases in main grid

## Benefits

✅ Users can personalize vocabulary
✅ Create custom categories
✅ Choose meaningful emojis
✅ Support bilingual learning
✅ Data persists across sessions
✅ No external dependencies required
