'use client';

import React from 'react';

interface MeasureWordPanelProps {
  showMeasureWord: boolean;
  setShowMeasureWord: (show: boolean) => void;
  MEASURE_WORD_CLASSIFIERS: Array<{ text: string; en: string; icon: string }>;
  VALID_CLASSIFIER_COMBINATIONS: Array<{ display: string; en: string; classifiers: string[] }>;
  MEASURE_WORD_UNITS: Array<{ text: string; en: string; icon: string }>;
  onMeasureWordSelected: (measureWord: string, english: string) => void;
}

const BilingualText = ({
  zh,
  en,
  className = '',
  enClassName = '',
}: {
  zh: string;
  en: string;
  className?: string;
  enClassName?: string;
}) => (
  <span className={`flex flex-col leading-tight ${className}`}>
    <span>{zh}</span>
    <span className={`text-sm sm:text-base opacity-80 ${enClassName}`}>{en}</span>
  </span>
);

export default function MeasureWordPanel({
  showMeasureWord,
  setShowMeasureWord,
  MEASURE_WORD_CLASSIFIERS,
  VALID_CLASSIFIER_COMBINATIONS,
  MEASURE_WORD_UNITS,
  onMeasureWordSelected,
}: MeasureWordPanelProps) {
  const [selectedClassifiers, setSelectedClassifiers] = React.useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState('');

  const handleClassifierSelect = (classifier: string) => {
    setSelectedClassifiers((prev) => {
      const updated = [...prev];
      const index = updated.indexOf(classifier);
      if (index > -1) {
        updated.splice(index, 1);
      } else if (updated.length < 2) {
        updated.push(classifier);
      }
      return updated;
    });
  };

  const isValidCombination = () => {
    if (selectedClassifiers.length === 0) return false;
    if (selectedClassifiers.length === 1) return true; // Single classifier is always valid
    
    // Check if the two-classifier combination is valid
    return VALID_CLASSIFIER_COMBINATIONS.some(
      (combo) =>
        combo.classifiers.length === 2 &&
        selectedClassifiers.every((c) => combo.classifiers.includes(c)) &&
        selectedClassifiers.length === 2
    );
  };

  const getDisplayText = () => {
    if (selectedClassifiers.length === 2) {
      const combo = VALID_CLASSIFIER_COMBINATIONS.find(
        (c) =>
          c.classifiers.length === 2 &&
          selectedClassifiers.every((sel) => c.classifiers.includes(sel)) &&
          c.classifiers.every((c) => selectedClassifiers.includes(c))
      );
      return combo ? combo.display : selectedClassifiers.join('');
    }
    return selectedClassifiers[0] || '';
  };

  const getEnglishText = () => {
    if (selectedClassifiers.length === 2) {
      const combo = VALID_CLASSIFIER_COMBINATIONS.find(
        (c) =>
          c.classifiers.length === 2 &&
          selectedClassifiers.every((sel) => c.classifiers.includes(sel)) &&
          c.classifiers.every((c) => selectedClassifiers.includes(c))
      );
      return combo ? combo.en : '';
    }
    const single = MEASURE_WORD_CLASSIFIERS.find((c) => c.text === selectedClassifiers[0]);
    return single ? single.en : '';
  };

  const handleNumberInput = (digit: string) => {
    setSelectedNumber((prev) => {
      if (!prev || prev === '0') return digit;
      return `${prev}${digit}`;
    });
  };

  const handleUnitSelect = (unit: string) => {
    setSelectedUnit(unit);
    if (!selectedNumber || !isValidCombination()) return;

    const measureWordDisplay = selectedNumber + getDisplayText() + unit;
    const unitData = MEASURE_WORD_UNITS.find((u) => u.text === unit);
    const measureWordEnglish = selectedNumber + ' ' + getEnglishText() + ' ' + (unitData?.en || unit);

    onMeasureWordSelected(measureWordDisplay, measureWordEnglish);

    // Reset
    setSelectedClassifiers([]);
    setSelectedNumber('');
    setSelectedUnit('');
    setShowMeasureWord(false);
  };

  if (!showMeasureWord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[60vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">
            <BilingualText zh="量詞" en="Numbers" />
          </h2>
          <button
            onClick={() => {
              setShowMeasureWord(false);
              setSelectedClassifiers([]);
              setSelectedNumber('');
              setSelectedUnit('');
            }}
            className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold"
            aria-label="關閉 Close"
          >
            ✕
          </button>
        </div>

        {/* Display */}
        <div className="mb-4 rounded-2xl border-2 border-[#1e3a5f] bg-[#f5f5dc] px-4 py-3">
          <div className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">
            {selectedNumber || '0'}{getDisplayText()}{selectedUnit}
          </div>
          <div className="text-sm sm:text-base text-[#1e3a5f] opacity-75">
            {selectedNumber && isValidCombination() && selectedUnit
              ? `${selectedNumber} ${getEnglishText()} ${MEASURE_WORD_UNITS.find((u) => u.text === selectedUnit)?.en || ''}`
              : '選擇數字 + 量詞 + 單位'}
          </div>
        </div>

        {!isValidCombination() && selectedClassifiers.length === 2 && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            只可用：十萬、百萬、千萬
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
          {/* Left: Numeric keypad */}
          <div className="bg-white rounded-2xl border-2 border-[#1e3a5f] p-3 sm:p-4">
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumberInput(digit)}
                  className="rounded-full bg-white text-[#1e3a5f] border-2 border-[#1e3a5f] font-bold text-lg sm:text-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:bg-[#f97316] hover:text-white transition-all"
                >
                  {digit}
                </button>
              ))}
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => handleNumberInput('0')}
                  className="rounded-full bg-white text-[#1e3a5f] border-2 border-[#1e3a5f] font-bold text-lg sm:text-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:bg-[#f97316] hover:text-white transition-all"
                >
                  0
                </button>
              </div>
            </div>
          </div>

          {/* Right: Classifiers + Units */}
          <div className="bg-white rounded-2xl border-2 border-[#1e3a5f] p-3 sm:p-4">
            <div>
              <div className="text-sm sm:text-base font-semibold text-[#1e3a5f] mb-2">
                量詞
              </div>
              <div className="grid grid-cols-5 gap-2">
                {MEASURE_WORD_CLASSIFIERS.map((c) => (
                  <button
                    key={c.text}
                    onClick={() => handleClassifierSelect(c.text)}
                    className={`h-10 sm:h-11 rounded-md text-sm sm:text-base font-bold border-2 transition-all ${
                      selectedClassifiers.includes(c.text)
                        ? 'bg-[#f97316] text-white border-[#f97316]'
                        : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-orange-100'
                    }`}
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-3 border-t border-[#1e3a5f]" />

            <div>
              <div className="text-sm sm:text-base font-semibold text-[#1e3a5f] mb-2">
                單位
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MEASURE_WORD_UNITS.map((unit) => (
                  <button
                    key={unit.text}
                    onClick={() => handleUnitSelect(unit.text)}
                    className={`h-10 sm:h-11 rounded-md text-sm sm:text-base font-bold border-2 transition-all flex items-center justify-center gap-1 ${
                      selectedUnit === unit.text
                        ? 'bg-[#f97316] text-white border-[#f97316]'
                        : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-orange-100'
                    }`}
                  >
                    <span>{unit.icon}</span>
                    <span>{unit.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
