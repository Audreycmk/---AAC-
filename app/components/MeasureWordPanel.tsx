'use client';

import React from 'react';
import Icon from './Icon';

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
  const [currentStep, setCurrentStep] = React.useState<'classifier' | 'number' | 'unit'>('classifier');
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

  const handleNumberInput = (num: string) => {
    setSelectedNumber(num);
  };

  const handleUnitSelect = (unit: string) => {
    setSelectedUnit(unit);
  };

  const handleComplete = () => {
    if (!selectedNumber || !selectedUnit || !isValidCombination()) return;

    const measureWordDisplay = selectedNumber + getDisplayText() + selectedUnit;
    const unitData = MEASURE_WORD_UNITS.find((u) => u.text === selectedUnit);
    const measureWordEnglish = selectedNumber + ' ' + getEnglishText() + ' ' + (unitData?.en || selectedUnit);

    onMeasureWordSelected(measureWordDisplay, measureWordEnglish);

    // Reset
    setCurrentStep('classifier');
    setSelectedClassifiers([]);
    setSelectedNumber('');
    setSelectedUnit('');
    setShowMeasureWord(false);
  };

  const handleBack = () => {
    if (currentStep === 'number') {
      setCurrentStep('classifier');
    } else if (currentStep === 'unit') {
      setCurrentStep('number');
    }
  };

  if (!showMeasureWord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">
            <BilingualText zh="量詞" en="Measure Words" />
          </h2>
          <button
            onClick={() => {
              setShowMeasureWord(false);
              setCurrentStep('classifier');
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

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6 text-center">
          {['classifier', 'number', 'unit'].map((s, idx) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === s
                    ? 'bg-[#f97316] text-white'
                    : ['classifier', 'number', 'unit'].indexOf(currentStep) > idx
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {s === 'classifier' && '分類'}
                {s === 'number' && '數字'}
                {s === 'unit' && '單位'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Classifier Selection */}
        {currentStep === 'classifier' && (
          <div>
            <p className="text-lg font-semibold mb-4 text-[#1e3a5f]">
              選擇分類 (Select 1-2 classifiers)
            </p>

            {selectedClassifiers.length === 2 && (
              <div className="bg-blue-100 p-3 rounded-lg mb-4 text-sm">
                <p className="text-[#1e3a5f] font-semibold">
                  {getDisplayText()} - {getEnglishText()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {MEASURE_WORD_CLASSIFIERS.map((c) => (
                <button
                  key={c.text}
                  onClick={() => handleClassifierSelect(c.text)}
                  className={`p-4 rounded-xl font-bold text-lg border-2 transition-all duration-200 ${
                    selectedClassifiers.includes(c.text)
                      ? 'bg-[#f97316] text-white border-[#f97316] scale-105'
                      : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-orange-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{c.icon}</span>
                  <div className="flex flex-col items-center">
                    <span>{c.text}</span>
                    <span className="text-xs opacity-75">{c.en}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Valid Combinations Info */}
            {selectedClassifiers.length === 1 && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-[#1e3a5f]">
                  ⭐ Valid 2-classifier combos: 十萬、百萬、千萬
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (isValidCombination() && selectedNumber === '') {
                  setCurrentStep('number');
                }
              }}
              disabled={!isValidCombination()}
              className="w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-lg hover:bg-[#ea580c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              下一步 (Next)
            </button>
          </div>
        )}

        {/* STEP 2: Number Input */}
        {currentStep === 'number' && (
          <div>
            <p className="text-lg font-semibold mb-4 text-[#1e3a5f]">
              選擇數字 (Enter number)
            </p>

            <div className="bg-blue-100 p-3 rounded-lg mb-4 text-sm">
              <p className="text-[#1e3a5f] font-semibold">
                分類: {getDisplayText()} ({getEnglishText()})
              </p>
            </div>

            <input
              type="number"
              value={selectedNumber}
              onChange={(e) => handleNumberInput(e.target.value)}
              placeholder="輸入數字..."
              className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl text-2xl font-bold text-center mb-4 focus:outline-none focus:border-[#f97316]"
            />

            {/* Quick number buttons */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['1', '2', '3', '5', '10'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumberInput(n)}
                  className={`py-2 rounded-lg font-bold text-lg border-2 transition-all ${
                    selectedNumber === n
                      ? 'bg-[#f97316] text-white border-[#f97316]'
                      : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-orange-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-300 text-[#1e3a5f] rounded-xl font-bold text-lg hover:bg-gray-400 transition-all"
              >
                上一步 (Back)
              </button>
              <button
                onClick={() => selectedNumber && setCurrentStep('unit')}
                disabled={!selectedNumber}
                className="flex-1 py-3 bg-[#f97316] text-white rounded-xl font-bold text-lg hover:bg-[#ea580c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                下一步 (Next)
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Unit Selection */}
        {currentStep === 'unit' && (
          <div>
            <p className="text-lg font-semibold mb-4 text-[#1e3a5f]">
              選擇單位 (Select unit)
            </p>

            <div className="bg-blue-100 p-3 rounded-lg mb-4 text-sm">
              <p className="text-[#1e3a5f] font-semibold">
                {selectedNumber} {getDisplayText()} = {selectedNumber}{getDisplayText()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 max-h-[300px] overflow-y-auto">
              {MEASURE_WORD_UNITS.map((unit) => (
                <button
                  key={unit.text}
                  onClick={() => handleUnitSelect(unit.text)}
                  className={`p-3 rounded-lg font-bold border-2 transition-all ${
                    selectedUnit === unit.text
                      ? 'bg-[#f97316] text-white border-[#f97316] scale-105'
                      : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-orange-100'
                  }`}
                >
                  <span className="text-xl mb-1">{unit.icon}</span>
                  <div className="text-xs flex flex-col items-center">
                    <span>{unit.text}</span>
                    <span className="opacity-75">{unit.en}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-300 text-[#1e3a5f] rounded-xl font-bold text-lg hover:bg-gray-400 transition-all"
              >
                上一步 (Back)
              </button>
              <button
                onClick={handleComplete}
                disabled={!selectedUnit}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                完成 (Done)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
