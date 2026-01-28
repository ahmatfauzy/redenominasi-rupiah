# 🇮🇩 Redenominasi Rupiah

[![npm version](https://badge.fury.io/js/redenominasi-rupiah.svg)](https://www.npmjs.com/package/redenominasi-rupiah)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Library JavaScript/TypeScript untuk konversi mata uang Rupiah Indonesia setelah redenominasi dengan rasio **1:1000**.

> **Apa itu Redenominasi?**  
> Redenominasi adalah penyederhanaan nilai nominal mata uang tanpa mengubah nilai tukar. Dengan rasio 1:1000, Rp 15.000 menjadi Rp 15.

## ✨ Fitur

- 🔄 **Konversi Dua Arah** - Convert (lama → baru) dan Revert (baru → lama)
- 📦 **Bulk Operations** - Konversi banyak nilai sekaligus
- 🎯 **Format Currency** - Format angka dengan simbol mata uang
- 🧹 **Input Sanitization** - Handle berbagai format angka Indonesia
- ⚙️ **Configurable** - Kustomisasi rasio, rounding, decimal places
- ⚛️ **React Integration** - Hooks, components, dan context provider
- 📝 **TypeScript Support** - Full type definitions
- 🎭 **Global Config** - Set konfigurasi sekali, gunakan di mana saja

## 📦 Instalasi

```bash
# npm
npm install redenominasi-rupiah

# yarn
yarn add redenominasi-rupiah

# pnpm
pnpm add redenominasi-rupiah

# bun
bun add redenominasi-rupiah
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { convert, revert, format } from 'redenominasi-rupiah';

// Konversi nominal lama ke baru (1:1000)
convert(15000);     // => 15
convert(500);       // => 0.5
convert(50);        // => 0.05

// Kembalikan ke nominal lama
revert(15);         // => 15000
revert(0.5);        // => 500

// Format sebagai string currency
format(15000);      // => "Rp 15.00"
format(500);        // => "Rp 0.50"
```

### Bulk Operations

```typescript
import { convertBulk, revertBulk, formatBulk } from 'redenominasi-rupiah';

const prices = [15000, 25000, 50000, 100000];

convertBulk(prices);  // => [15, 25, 50, 100]
revertBulk([15, 25]); // => [15000, 25000]
formatBulk(prices);   // => ["Rp 15.00", "Rp 25.00", "Rp 50.00", "Rp 100.00"]
```

### Input Sanitization

```typescript
import { sanitizeInput } from 'redenominasi-rupiah';

// Handle format angka Indonesia
sanitizeInput("15.000");      // => 15000 (titik sebagai separator ribuan)
sanitizeInput("15,50");       // => 15.5 (koma sebagai separator desimal)
sanitizeInput("1.000.000");   // => 1000000
sanitizeInput("Rp 15000");    // => 15000
sanitizeInput("abc");         // => null (invalid)
```

## ⚙️ Konfigurasi

### Configuration Options

```typescript
interface RedenominasiConfig {
  ratio?: number;                    // Rasio konversi (default: 1000)
  roundingMode?: 'floor' | 'ceil' | 'round';  // Mode pembulatan (default: 'round')
  decimalPlaces?: number;            // Jumlah desimal (default: 2)
  showCurrency?: boolean;            // Tampilkan simbol (default: true)
  currencySymbol?: string;           // Simbol mata uang (default: 'Rp')
  locale?: string;                   // Locale format (default: 'id-ID')
  useThousandsSeparator?: boolean;   // Separator ribuan (default: true)
  allowNegative?: boolean;           // Izinkan nilai negatif (default: true)
}
```

### Per-Call Configuration

```typescript
import { convert, format } from 'redenominasi-rupiah';

// Custom ratio
convert(2000, { ratio: 2000 });  // => 1

// Custom rounding
convert(1555, { roundingMode: 'floor' });  // => 1.55
convert(1555, { roundingMode: 'ceil' });   // => 1.56

// Format options
format(15000, { config: { showCurrency: false } });     // => "15.00"
format(15000, { config: { currencySymbol: 'IDR' } });   // => "IDR 15.00"
format(15000, { config: { decimalPlaces: 0 } });        // => "Rp 15"

// Custom prefix/suffix
format(15000, { customPrefix: '[', customSuffix: ']' }); // => "[Rp 15.00]"
```

### Global Configuration

```typescript
import { 
  setGlobalConfig, 
  getGlobalConfig, 
  resetGlobalConfig,
  convert,
  format 
} from 'redenominasi-rupiah';

// Set global config (akan digunakan oleh semua fungsi)
setGlobalConfig({
  currencySymbol: 'IDR',
  decimalPlaces: 0,
  showCurrency: true
});

// Sekarang semua fungsi menggunakan config global
format(15000);  // => "IDR 15"

// Check current config
console.log(getGlobalConfig());  // => { currencySymbol: 'IDR', ... }

// Reset ke default
resetGlobalConfig();
format(15000);  // => "Rp 15.00"
```

## ⚛️ React Integration

### Using the Hook

```tsx
import { useRedenominasi } from 'redenominasi-rupiah/react';

function PriceDisplay({ price }: { price: number }) {
  const { convert, format, formatBulk } = useRedenominasi();
  
  return (
    <div>
      <p>Harga Lama: Rp {price.toLocaleString()}</p>
      <p>Harga Baru: {format(price)}</p>
      <p>Nilai: {convert(price)}</p>
    </div>
  );
}

// With custom config
function CustomPriceDisplay({ price }: { price: number }) {
  const { format } = useRedenominasi({ 
    showCurrency: false,
    decimalPlaces: 0 
  });
  
  return <span>{format(price)}</span>;  // => "15"
}
```

### Using Components

```tsx
import { CurrencyDisplay, CurrencyInput } from 'redenominasi-rupiah/react';

// Display Component
function ProductCard({ price }: { price: number }) {
  return (
    <div>
      <CurrencyDisplay value={price} />
      {/* Renders: "Rp 15.00" */}
      
      <CurrencyDisplay 
        value={price} 
        config={{ showCurrency: false }}
        as="div"
        className="price-tag"
      />
      {/* Renders: <div class="price-tag">15.00</div> */}
      
      <CurrencyDisplay 
        value={price}
        prefix="Harga: "
        suffix=" /item"
      />
      {/* Renders: "Harga: Rp 15.00 /item" */}
    </div>
  );
}

// Input Component
function PriceForm() {
  const [amount, setAmount] = useState(0);
  
  return (
    <CurrencyInput
      value={amount}
      onChange={setAmount}
      placeholder="Masukkan harga"
      showPreview={true}  // Shows live conversion preview
    />
  );
}
```

### Using Context Provider

```tsx
import { 
  RedenominasiProvider, 
  useRedenominasiContext,
  CurrencyDisplay 
} from 'redenominasi-rupiah/react';

// Wrap your app
function App() {
  return (
    <RedenominasiProvider config={{ 
      currencySymbol: 'IDR',
      decimalPlaces: 0 
    }}>
      <ProductList />
    </RedenominasiProvider>
  );
}

// Access config anywhere
function ProductList() {
  const { config } = useRedenominasiContext();
  // All CurrencyDisplay children will use this config
  
  return (
    <div>
      <CurrencyDisplay value={15000} />
      <CurrencyDisplay value={25000} />
    </div>
  );
}
```

## 📚 API Reference

### Core Functions

| Function | Description | Example |
|----------|-------------|---------|
| `convert(value, config?)` | Convert old nominal to new | `convert(15000) => 15` |
| `revert(value, config?)` | Revert new nominal to old | `revert(15) => 15000` |
| `convertBulk(values, config?)` | Convert multiple values | `convertBulk([15000, 25000])` |
| `revertBulk(values, config?)` | Revert multiple values | `revertBulk([15, 25])` |
| `format(value, options?)` | Format as currency string | `format(15000) => "Rp 15.00"` |
| `formatBulk(values, options?)` | Format multiple values | `formatBulk([15000, 25000])` |
| `sanitizeInput(input)` | Parse user input string | `sanitizeInput("15.000") => 15000` |
| `isValidValue(value)` | Validate if number is valid | `isValidValue(NaN) => false` |
| `mergeConfig(config?)` | Merge config with defaults | `mergeConfig({ ratio: 100 })` |

### Global Config Functions

| Function | Description |
|----------|-------------|
| `setGlobalConfig(config)` | Set global configuration |
| `getGlobalConfig()` | Get current global config |
| `resetGlobalConfig()` | Reset to default config |

### Rounding Functions

| Function | Description |
|----------|-------------|
| `applyRounding(value, mode, decimals)` | Apply rounding with mode |
| `floorValue(value, decimals)` | Round down |
| `ceilValue(value, decimals)` | Round up |
| `roundValue(value, decimals)` | Standard rounding |

### React Exports

| Export | Type | Description |
|--------|------|-------------|
| `useRedenominasi` | Hook | Main hook for conversions |
| `CurrencyDisplay` | Component | Display formatted currency |
| `CurrencyInput` | Component | Input with validation |
| `RedenominasiProvider` | Component | Context provider |
| `useRedenominasiContext` | Hook | Access context config |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🏗️ Building

```bash
# Build for production
npm run build

# Watch mode for development
npm run build:watch
```

## 📄 License

MIT © [ahmatfauzy](https://github.com/ahmatfauzy)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
