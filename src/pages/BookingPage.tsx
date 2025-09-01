import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  Star,
  Shield,
  CreditCard,
  Upload,
  CheckCircle
} from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { useReservations } from '../hooks/useReservations';
import toast from 'react-hot-toast';

interface BookingPageProps {
  user: any;
}

const BookingPage: React.FC<BookingPageProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const { createReservation } = useReservations(user?.id, user?.profile?.role);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    weight: '',
    dimensions: '',
    description: '',
    value: '',
    insurance: false,
    pickupAddress: '',
    deliveryAddress: '',
    pickupDate: '',
    pickupTime: '',
    photos: [] as string[]
  });

  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Trajet non trouvé
          </h3>
          <Link to="/search" className="text-emerald-600 hover:text-emerald-700">
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Mock photo upload
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setBookingData({
        ...bookingData,
        photos: [...bookingData.photos, ...newPhotos]
      });
    }
  };

  const handleSubmit = async () => {
    if (!user || !trip) return;

    setLoading(true);
    try {
      const total_price = parseFloat(bookingData.weight) * trip.price_per_kg;

      const reservationData = {
        trip_id: trip.id,
        client_id: user.id,
        transporteur_id: trip.transporteur_id,
        total_price,
        pickup_address: bookingData.pickupAddress,
        delivery_address: bookingData.deliveryAddress,
        pickup_date: bookingData.pickupDate || new Date().toISOString()
      };

      const expeditionData = {
        weight: bookingData.weight,
        description: bookingData.description,
        departure_city: trip.departure_city, // Utiliser les infos du trajet
        destination_city: trip.destination_city, // Utiliser les infos du trajet
        content_type: bookingData.description // Ou un champ spécifique pour le type de contenu
      };

      console.log('Submitting reservation data:', reservationData);

      await createReservation(reservationData, expeditionData);

      toast.success('Réservation confirmée!');
      navigate('/tracking');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Détails du colis
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Poids (kg) *
          </label>
          <input
            type="number"
            required
            value={bookingData.weight}
            onChange={(e) => setBookingData({ ...bookingData, weight: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: 5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dimensions (cm)
          </label>
          <input
            type="text"
            value={bookingData.dimensions}
            onChange={(e) => setBookingData({ ...bookingData, dimensions: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: 30x20x15"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description du contenu *
        </label>
        <textarea
          required
          value={bookingData.description}
          onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          placeholder="Décrivez le contenu de votre colis..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valeur déclarée (MAD)
        </label>
        <input
          type="number"
          value={bookingData.value}
          onChange={(e) => setBookingData({ ...bookingData, value: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          placeholder="Ex: 1000"
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="insurance"
          checked={bookingData.insurance}
          onChange={(e) => setBookingData({ ...bookingData, insurance: e.target.checked })}
          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="insurance" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Ajouter une assurance (+50 MAD)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Photos du colis (optionnel)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Cliquez pour ajouter des photos
            </p>
          </label>
        </div>
        {bookingData.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {bookingData.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Adresses et horaires
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse de ramassage *
        </label>
        <textarea
          required
          value={bookingData.pickupAddress}
          onChange={(e) => setBookingData({ ...bookingData, pickupAddress: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          placeholder="Adresse complète de ramassage..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse de livraison *
        </label>
        <textarea
          required
          value={bookingData.deliveryAddress}
          onChange={(e) => setBookingData({ ...bookingData, deliveryAddress: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          placeholder="Adresse complète de livraison..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date de ramassage souhaitée
          </label>
          <input
            type="date"
            value={bookingData.pickupDate}
            onChange={(e) => setBookingData({ ...bookingData, pickupDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heure de ramassage
          </label>
          <input
            type="time"
            value={bookingData.pickupTime}
            onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const subtotal = parseFloat(bookingData.weight || '0') * trip.price_per_kg;
    const insurance = bookingData.insurance ? 50 : 0;
    const fees = Math.round(subtotal * 0.1);
    const total = subtotal + insurance + fees;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Récapitulatif et paiement
        </h3>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Résumé de la commande</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Transport ({bookingData.weight}kg)</span>
              <span>{subtotal} MAD</span>
            </div>
            {bookingData.insurance && (
              <div className="flex justify-between">
                <span>Assurance</span>
                <span>{insurance} MAD</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frais de service</span>
              <span>{fees} MAD</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{total} MAD</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Méthode de paiement</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input type="radio" name="payment" value="card" defaultChecked className="text-emerald-600" />
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span>Carte bancaire</span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input type="radio" name="payment" value="mobile" className="text-emerald-600" />
              <div className="h-5 w-5 bg-orange-500 rounded"></div>
              <span>Mobile Money (Orange, Wave)</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/search"
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Réservation de transport
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                    {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 ml-auto"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Confirmation...' : 'Confirmer la réservation'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Transporteur sélectionné
              </h3>

              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                  alt={'Transporteur'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Transporteur
                    </h4>
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>4.8</span>
                    <span>(24 avis)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{trip.departure_city} → {trip.destination_city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Départ: {new Date(trip.departure_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Durée: 2-3 jours
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Prix de base:</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {trip.price_per_kg} MAD/kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;