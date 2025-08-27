import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronRight,
  Book,
  Users,
  Shield,
  CreditCard,
  Package,
  Truck,
  Star,
  AlertCircle
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Général',
      icon: HelpCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      faqs: [
        {
          question: 'Comment fonctionne KoliGo ?',
          answer: 'KoliGo connecte les personnes qui veulent envoyer des colis avec des transporteurs (particuliers ou professionnels) qui voyagent sur les mêmes trajets. Vous pouvez rechercher des transporteurs, comparer les prix et réserver en ligne.'
        },
        {
          question: 'Dans quels pays KoliGo est-il disponible ?',
          answer: 'KoliGo est actuellement disponible entre le Maroc et le Sénégal, avec des extensions prévues vers d\'autres pays d\'Afrique et d\'Europe.'
        },
        {
          question: 'Comment créer un compte ?',
          answer: 'Cliquez sur "Connexion" puis "S\'inscrire". Choisissez votre rôle (Client ou Transporteur), remplissez vos informations et vérifiez votre email.'
        }
      ]
    },
    {
      title: 'Envoi de colis',
      icon: Package,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      faqs: [
        {
          question: 'Quels objets puis-je envoyer ?',
          answer: 'Vous pouvez envoyer la plupart des objets personnels : vêtements, électronique, documents, cadeaux. Les objets interdits incluent : argent liquide, produits dangereux, stupéfiants, armes, produits périssables non autorisés.'
        },
        {
          question: 'Comment calculer le prix d\'envoi ?',
          answer: 'Le prix dépend du poids, de la distance, du mode de transport et de la demande. Utilisez notre calculateur en ligne pour obtenir un devis instantané.'
        },
        {
          question: 'Mon colis est-il assuré ?',
          answer: 'Une assurance de base est incluse. Vous pouvez souscrire une assurance complémentaire lors de la réservation pour une couverture étendue.'
        }
      ]
    },
    {
      title: 'Transport',
      icon: Truck,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      faqs: [
        {
          question: 'Comment devenir transporteur ?',
          answer: 'Inscrivez-vous en tant que transporteur, complétez votre profil, téléchargez vos documents (ID, permis, assurance) et attendez la vérification. Une fois approuvé, vous pouvez proposer vos trajets.'
        },
        {
          question: 'Quels documents sont requis ?',
          answer: 'Pour les particuliers : pièce d\'identité et selfie. Pour les professionnels : licence de transport, assurance, carte grise du véhicule.'
        },
        {
          question: 'Comment fixer mes tarifs ?',
          answer: 'Vous pouvez utiliser nos tarifs suggérés ou fixer vos propres prix. Le système vous aide à rester compétitif tout en maximisant vos revenus.'
        }
      ]
    },
    {
      title: 'Paiements',
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      faqs: [
        {
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (Orange Money, Wave, Free Money) et les virements bancaires.'
        },
        {
          question: 'Quand suis-je débité ?',
          answer: 'Un acompte est prélevé à la réservation. Le solde est débité à la confirmation de livraison ou libéré automatiquement après 48h sans litige.'
        },
        {
          question: 'Comment retirer mes gains ?',
          answer: 'Les transporteurs peuvent retirer leurs gains via Mobile Money, virement bancaire ou sur leur portefeuille KoliGo.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: 'Chat en direct',
      description: 'Discutez avec notre équipe support',
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      action: 'Démarrer le chat'
    },
    {
      title: 'Téléphone',
      description: '+212 5 22 XX XX XX',
      icon: Phone,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      action: 'Appeler'
    },
    {
      title: 'Email',
      description: 'support@koligo.com',
      icon: Mail,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      action: 'Envoyer un email'
    }
  ];

  const quickLinks = [
    { title: 'Guide utilisateur', icon: Book, href: '#' },
    { title: 'Communauté', icon: Users, href: '#' },
    { title: 'Sécurité', icon: Shield, href: '#' },
    { title: 'Conditions d\'utilisation', icon: AlertCircle, href: '#' }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Centre d'aide KoliGo
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            Trouvez rapidement les réponses à vos questions
          </motion.p>

          {/* Search */}
          <motion.div 
            variants={itemVariants}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white text-lg"
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Questions fréquentes
              </motion.h2>

              {filteredFaqs.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={categoryIndex}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className={`${category.bgColor} p-2 rounded-lg`}>
                          <Icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {category.faqs.map((faq, faqIndex) => {
                        const faqId = categoryIndex * 100 + faqIndex;
                        const isExpanded = expandedFaq === faqId;
                        
                        return (
                          <div key={faqIndex}>
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                              className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {faq.question}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="px-6 pb-4">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {searchQuery && filteredFaqs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Essayez avec d'autres mots-clés ou contactez notre support
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Options */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              >
                Besoin d'aide ?
              </motion.h3>
              <div className="space-y-3">
                {contactOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className={`${option.bgColor} p-2 rounded-lg`}>
                        <Icon className={`h-4 w-4 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              >
                Liens utiles
              </motion.h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={index}
                      variants={itemVariants}
                      href={link.href}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 p-6 rounded-xl text-white"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium">Tous les systèmes opérationnels</span>
              </div>
              <p className="text-emerald-100 text-sm">
                Dernière mise à jour: il y a 2 minutes
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;