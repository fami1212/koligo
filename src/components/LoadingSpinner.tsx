import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 p-4 rounded-full mb-4 mx-auto w-fit"
        >
          <Globe className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-2"
        >
          KoliGo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Chargement en cours...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;