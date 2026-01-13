"use client";

import React, { useState } from "react";
import {
  convert,
  format,
  revert,
  convertBulk,
  formatBulk,
  sanitizeInput,
} from "../src/core";
import { useRedenominasi } from "../src/react/hooks/useRedenominasi";
// import { CurrencyDisplay } from "../src/react/components/CurrencyDisplay";
// import { CurrencyInput } from "../src/react/components/CurrencyInput";


export default function Home() {
  const [inputValue, setInputValue] = useState<number>(15000);
  const { format: formatWithHook, convert: convertWithHook } =
    useRedenominasi();

  const testPrices = [15000, 500, 1000, 2500, 100];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Redenominasi Rupiah
          </h1>
          <p className="text-xl text-gray-600">
            Indonesian Rupiah Redenomination Library - 1:1000 Conversion
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Basic Conversion */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Basic Conversion
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Old: <span className="font-bold text-gray-900">15,000</span>
              </p>
              <p className="text-gray-700">
                New: <span className="font-bold text-green-600">15</span>
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm text-gray-800">
                convert(15000) = {convert(15000)}
              </code>
            </div>
          </div>

          {/* Card 2: Formatted Display */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Formatted Display
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Old: <span className="font-bold text-gray-900">15,000</span>
              </p>
              <p className="text-gray-700">
                Formatted:{" "}
                <span className="font-bold text-green-600">
                  {format(15000)}
                </span>
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm text-gray-800">
                format(15000) = "{format(15000)}"
              </code>
            </div>
          </div>

          {/* Card 3: Revert Conversion */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Revert Back
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                New: <span className="font-bold text-gray-900">15</span>
              </p>
              <p className="text-gray-700">
                Old: <span className="font-bold text-green-600">15,000</span>
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm text-gray-800">
                revert(15) = {revert(15)}
              </code>
            </div>
          </div>
        </div>

        {/* Interactive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Input */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Interactive Converter
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Enter Old Nominal (Rp):
                </label>
                <input
                  type="text"
                  value={inputValue.toLocaleString("id-ID")}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value);
                    if (sanitized !== null) setInputValue(sanitized);
                  }}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Old Nominal:</span>{" "}
                  <span className="text-lg font-bold text-blue-600">
                    Rp {inputValue.toLocaleString("id-ID")}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">New Nominal:</span>{" "}
                  <span className="text-lg font-bold text-green-600">
                    {convert(inputValue)}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Formatted:</span>{" "}
                  <span className="text-lg font-bold text-green-600">
                    {format(inputValue)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bulk Conversion */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bulk Conversion
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Converting {testPrices.length} values at once:
              </p>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Old Values:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {testPrices.map((price) => (
                    <div
                      key={price}
                      className="bg-gray-100 px-3 py-2 rounded text-sm text-gray-700"
                    >
                      Rp {price.toLocaleString("id-ID")}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Converted Values:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {convertBulk(testPrices).map((value, i) => (
                    <div
                      key={i}
                      className="bg-green-100 px-3 py-2 rounded text-sm text-green-700 font-semibold"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Formatted Values:
                </p>
                <div className="space-y-1">
                  {formatBulk(testPrices).map((formatted, i) => (
                    <div
                      key={i}
                      className="bg-indigo-50 px-3 py-2 rounded text-sm text-indigo-700 font-semibold"
                    >
                      {formatted}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edge Cases */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Edge Cases & Special Scenarios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Values */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3">Small Values</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  Input: <span className="font-bold">50</span>
                </p>
                <p className="text-gray-700">
                  Output: <span className="font-bold text-green-600">0.05</span>
                </p>
                <p className="text-gray-700">
                  Formatted:{" "}
                  <span className="font-bold text-green-600">{format(50)}</span>
                </p>
              </div>
            </div>

            {/* Decimal Handling */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3">Decimal Handling</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  Input: <span className="font-bold">500</span>
                </p>
                <p className="text-gray-700">
                  Output: <span className="font-bold text-green-600">0.5</span>
                </p>
                <p className="text-gray-700">
                  Formatted:{" "}
                  <span className="font-bold text-green-600">
                    {format(500)}
                  </span>
                </p>
              </div>
            </div>

            {/* Rounding Modes */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3">Rounding</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  Input: <span className="font-bold">1555</span>
                </p>
                <p className="text-gray-700">
                  Round:{" "}
                  <span className="font-bold text-green-600">
                    {convert(1555, { roundingMode: "round" })}
                  </span>
                </p>
                <p className="text-gray-700">
                  Floor:{" "}
                  <span className="font-bold text-green-600">
                    {convert(1555, { roundingMode: "floor" })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Code Examples</h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-yellow-300 font-semibold mb-2">
                Import & Use Core Functions:
              </p>
              <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                {`import { convert, format, revert } from 'redenominasi-rupiah';

// Convert old to new
convert(15000) // 15

// Format with currency
format(15000) // "Rp 15.00"

// Revert back
revert(15) // 15000`}
              </pre>
            </div>

            <div>
              <p className="text-yellow-300 font-semibold mb-2">
                Use React Hooks:
              </p>
              <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                {`import { useRedenominasi } from 'redenominasi-rupiah/react';

function MyComponent() {
  const { convert, format } = useRedenominasi();
  
  return <div>{format(15000)}</div>; // "Rp 15.00"
}`}
              </pre>
            </div>

            <div>
              <p className="text-yellow-300 font-semibold mb-2">
                Custom Configuration:
              </p>
              <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                {`const config = {
  ratio: 1000,
  roundingMode: 'ceil',
  decimalPlaces: 3,
  currencySymbol: 'IDR'
};

format(15000, { config });
// "IDR 15.000"`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>Redenominasi Rupiah Library v1.0.0 - Ready for NPM Publication</p>
          <p className="mt-2 text-sm">
            Full documentation available in README.md and TESTING_GUIDE.md
          </p>
        </div>
      </div>
    </main>
  );
}
