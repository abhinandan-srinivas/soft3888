// This file provided the card layouts used in CardConstructor
// Class name syntax:
//  - Primary: the card's main number and KPI (the larger number displayed on the card)
//  - Secondary: the card's subheading numbers (the smaller numbers displayed on the card)
//  - Free Content: the card accepts children prop to display in the card

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Picker,
  ActionSheetIOS,
} from 'react-native';

const styles = StyleSheet.create({
  // Data Cards
  cardContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
  },
  cardInnerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  cardWithSeparateTitle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardSummary: {
    alignItems: 'center',
  },
  cardPrimarySummary: {
    width: '36%',
  },
  cardSecondarySummary: {
    height: 80,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardSubheading: {
    textAlign: 'center',
    // textAlignVertical: 'center',
    fontSize: 14,
    width: 80,
    height: 34,
  },
  cardTitleNumber: {
    fontSize: 56,
    lineHeight: 56,
  },
  cardSubheadingNumber: {
    fontSize: 32,
    lineHeight: 45,
  },
});

export function CardHeading({ children }) {
  return (
    <Text style={styles.cardTitle}>{ children }</Text>
  );
}

export function CardSubheading({ children, variant }) {
  if (variant) {
    return (
      <Text style={[styles.cardSubheading, variant]}>{ children }</Text>
    );
  }
  return (
    <Text style={[styles.cardSubheading, { textAlignVertical: 'bottom' }]}>{ children }</Text>
  );
}

export function CardSummary({ children, viewVariant }) {
  return (
    <View style={[styles.cardSummary, viewVariant]}>
      { children }
    </View>
  );
}

export function CardPrimarySummary({ title, number }) {
  return (
    <CardSummary>
      <CardHeading>{ title }</CardHeading>
      <Text style={styles.cardTitleNumber}>{ number }</Text>
    </CardSummary>
  );
}

export function CardSecondarySummary({
  title, number, subheadingVariant, viewVariant,
}) {
  return (
    <CardSummary viewVariant={viewVariant}>
      <CardSubheading variant={subheadingVariant}>{ title }</CardSubheading>
      <Text style={styles.cardSubheadingNumber}>{ number }</Text>
    </CardSummary>
  );
}

export function BlankCard({ title, children }) {
  return (
    <View style={[styles.cardContainer, styles.cardWithSeparateTitle]}>
      <CardHeading>{title}</CardHeading>
      {children}
    </View>
  );
}

export function Card1TitlePrimary2Secondary({ primary, secondary1, secondary2, pressHandler }) {
  return (
    <View style={[styles.cardContainer, styles.cardInnerContainer]} onPress={pressHandler}>
      <CardPrimarySummary title={primary.title} number={primary.number} />
      <CardSecondarySummary title={secondary1.title} number={secondary1.number} />
      <CardSecondarySummary title={secondary2.title} number={secondary2.number} />
    </View>
  );
}

export function CardTitle3Secondary({
  title, secondary1, secondary2, secondary3,
}) {
  return (
    <View style={[styles.cardContainer, styles.cardWithSeparateTitle]}>
      <CardHeading>{title}</CardHeading>
      <View style={styles.cardInnerContainer}>
        <CardSummary>
          <CardSubheading variant={{ textAlignVertical: 'top' }}>{secondary1.title}</CardSubheading>
          <Text style={styles.cardTitleNumber}>{secondary1.number}</Text>
        </CardSummary>
        <CardSecondarySummary title={secondary2.title} number={secondary2.number} subheadingVariant={{ textAlignVertical: 'top' }} />
        <CardSecondarySummary title={secondary3.title} number={secondary3.number} subheadingVariant={{ textAlignVertical: 'top' }} />
      </View>
    </View>
  );
}

export function Card1TitlePrimary1FreeContent({ primary, children }) {
  return (
    <View style={[styles.cardContainer, styles.cardInnerContainer]}>
      <CardPrimarySummary title={primary.title} number={primary.number} />
      { children }
    </View>
  );
}
