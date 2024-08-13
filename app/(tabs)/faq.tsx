import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const faqData = [
  {
    question: 'Wat is Avelius?',
    answer: 'Avelius is een advocatenkantoor dat gespecialiseerd is in verschillende rechtsgebieden en biedt een eenvoudig online boekingssysteem voor afspraken.',
  },
  {
    question: 'Hoe kan ik een afspraak boeken?',
    answer: 'U kunt een afspraak boeken via onze app door naar de afspraakboeking sectie te gaan en een beschikbare tijd te selecteren.',
  },
  {
    question: 'Wat zijn de kosten voor een consultatie?',
    answer: 'De kosten voor een consultatie verschillen afhankelijk van het type zaak. Neem contact met ons op voor meer informatie.',
  },
  // Voeg hier meer FAQ's toe
];

const FaqScreen = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setSelectedQuestion(selectedQuestion === index ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {faqData.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <TouchableOpacity onPress={() => toggleQuestion(index)}>
            <Text style={styles.question}>{item.question}</Text>
          </TouchableOpacity>
          {selectedQuestion === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
});

export default FaqScreen;
