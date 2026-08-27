import {
  QrCodeIcon,
  CreditCardIcon,
  WalletIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface PaymentMethodIconProps {
  iconName?: string | null;
  className?: string;
}

export const PaymentMethodIcon = ({ iconName, className = 'h-4 w-4 text-sky-600' }: PaymentMethodIconProps) => {
  if (!iconName) return null;

  const normalized = iconName.trim();

  switch (normalized) {
    case 'QrCodeIcon':
      return <QrCodeIcon className={className} />;
    case 'CreditCardIcon':
      return <CreditCardIcon className={className} />;
    case 'WalletIcon':
      return <WalletIcon className={className} />;
    default:
      return <AdjustmentsHorizontalIcon className={className} />;
  }
};

export default PaymentMethodIcon;
