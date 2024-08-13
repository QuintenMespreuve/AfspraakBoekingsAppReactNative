import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import { ref, set, get } from "firebase/database";
import { db } from '../../firebaseConfig';
import Header from '../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleBooking = () => {
    if (!name || !email || !date) {
      if (Platform.OS === 'web') {
        toast.error('Alle verplichte velden moeten worden ingevuld.');
      } else {
        Alert.alert('Error', 'Alle verplichte velden moeten worden ingevuld.');
      }
      return;
    }

    if (!validateEmail(email)) {
      if (Platform.OS === 'web') {
        toast.error('Voer een geldig e-mailadres in.');
      } else {
        Alert.alert('Error', 'Voer een geldig e-mailadres in.');
      }
      return;
    }

    const bookingDate = date.toISOString().split('T')[0];

    const existingBooking = bookings.find(booking => booking.date.startsWith(bookingDate));
    if (existingBooking) {
      if (Platform.OS === 'web') {
        toast.error('Er is al een boeking op deze datum.');
      } else {
        Alert.alert('Error', 'Er is al een boeking op deze datum.');
      }
      return;
    }

    const bookingId = Date.now().toString();
    const bookingData = {
      name,
      email,
      info,
      date: date.toISOString(),
    };

    set(ref(db, 'bookings/' + bookingId), bookingData)
      .then(() => {
        if (Platform.OS === 'web') {
          toast.success('Uw afspraak is succesvol geboekt!');
        } else {
          Alert.alert('Succes', 'Uw afspraak is succesvol geboekt!');
        }
        setName('');
        setEmail('');
        setInfo('');
        setDate(null);
        fetchBookings();
      })
      .catch((error) => {
        if (Platform.OS === 'web') {
          toast.error('Er is een fout opgetreden: ' + error.message);
        } else {
          Alert.alert('Error', 'Er is een fout opgetreden: ' + error.message);
        }
      });
  };

  const fetchBookings = () => {
    const bookingsRef = ref(db, 'bookings');
    get(bookingsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedBookings = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setBookings(loadedBookings);
        } else {
          setBookings([]);
        }
      })
      .catch((error) => {
        console.error("Error bij het ophalen van de boekingen:", error);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.label}>Naam:</Text>
        <TextInput
          style={styles.input}
          placeholder="Uw naam"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>E-mailadres:</Text>
        <TextInput
          style={styles.input}
          placeholder="Uw e-mailadres"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Extra informatie:</Text>
        <TextInput
          style={styles.input}
          placeholder="Extra informatie (optioneel)"
          value={info}
          onChangeText={setInfo}
        />

        <Text style={styles.label}>Datum:</Text>
        {Platform.OS === 'web' ? (
          <DatePicker
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate as Date)}
            inline
          />
        ) : (
          <>
            <Button title={date ? date.toDateString() : "Kies een datum"} onPress={() => setShowPicker(true)} />
            {showPicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}

        <Button title="Boek Afspraak" onPress={handleBooking} />

        <Text style={styles.bookingTitle}>Huidige Boekingen:</Text>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <Text style={styles.bookingText}>Naam: {item.name}</Text>
              <Text style={styles.bookingText}>E-mail: {item.email}</Text>
              <Text style={styles.bookingText}>Datum: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.bookingText}>Info: {item.info}</Text>
            </View>
          )}
        />
      </View>
      <ToastContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bookingItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  bookingText: {
    fontSize: 16,
  },
});

export default BookingScreen;
