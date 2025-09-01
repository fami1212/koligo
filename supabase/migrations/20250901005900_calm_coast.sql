/*
  # Add currency field to trips table

  1. Changes
    - Add `currency` column to `trips` table with default 'MAD'
    - Add check constraint for supported currencies
    - Update existing trips to have MAD as default currency

  2. Supported Currencies
    - MAD (Moroccan Dirham)
    - EUR (Euro)
    - USD (US Dollar)
    - XOF (West African CFA Franc)
    - GBP (British Pound)
    - CAD (Canadian Dollar)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'currency'
  ) THEN
    ALTER TABLE trips ADD COLUMN currency text DEFAULT 'MAD';
    
    -- Add check constraint for supported currencies
    ALTER TABLE trips ADD CONSTRAINT trips_currency_check 
    CHECK (currency IN ('MAD', 'EUR', 'USD', 'XOF', 'GBP', 'CAD'));
  END IF;
END $$;