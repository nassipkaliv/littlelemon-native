import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createTable,
  filterByQueryAndCategories,
  getMenuItems,
  saveMenuItems,
} from '../database';
import { colors } from '../theme';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const imageUrl = (fileName) =>
  `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${fileName}?raw=true`;

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Hero({ query, onQueryChange }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Little Lemon</Text>
      <View style={styles.heroRow}>
        <View style={styles.heroTextCol}>
          <Text style={styles.heroSubtitle}>Chicago</Text>
          <Text style={styles.heroDescription}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served
            with a modern twist.
          </Text>
        </View>
        <Image
          source={require('../../assets/hero.jpg')}
          style={styles.heroImage}
          accessibilityLabel="Bruschetta served at Little Lemon"
        />
      </View>
      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes"
          placeholderTextColor="#7d8a86"
          value={query}
          onChangeText={onQueryChange}
          clearButtonMode="while-editing"
          accessibilityLabel="Search menu"
        />
      </View>
    </View>
  );
}

function MenuBreakdown({ selected, onToggle }) {
  return (
    <View style={styles.breakdown}>
      <Text style={styles.breakdownTitle}>ORDER FOR DELIVERY!</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => {
          const active = selected.includes(c);
          return (
            <Pressable
              key={c}
              onPress={() => onToggle(c)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function MenuItem({ item }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemText}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
      </View>
      <Image source={{ uri: imageUrl(item.image) }} style={styles.itemImage} />
    </View>
  );
}

export default function HomeScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const debouncedQuery = useDebounced(query, 400);
  const ready = useRef(false);

  // Load menu: from SQLite if cached, otherwise fetch from the API and cache it.
  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let items = await getMenuItems();
        if (items.length === 0) {
          const response = await fetch(API_URL);
          const json = await response.json();
          await saveMenuItems(json.menu);
          items = await getMenuItems();
        }
        setMenu(items);
        ready.current = true;
      } catch (e) {
        console.warn(e);
        setError('Could not load the menu. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Re-query SQLite when search text or selected categories change.
  useEffect(() => {
    if (!ready.current) return;
    let cancelled = false;
    filterByQueryAndCategories(debouncedQuery, selected)
      .then((items) => !cancelled && setMenu(items))
      .catch((e) => console.warn(e));
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selected]);

  const toggleCategory = (c) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const header = useMemo(
    () => (
      <>
        <Hero query={query} onQueryChange={setQuery} />
        <MenuBreakdown selected={selected} onToggle={toggleCategory} />
      </>
    ),
    [query, selected]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MenuItem item={item} />}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.empty} color={colors.primary} />
          ) : (
            <Text style={[styles.empty, styles.emptyText]}>{error ?? 'No dishes match your search.'}</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: { backgroundColor: colors.primary, padding: 16, paddingBottom: 20 },
  heroTitle: { color: colors.yellow, fontSize: 40, fontWeight: '600' },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroTextCol: { flex: 1 },
  heroSubtitle: { color: colors.white, fontSize: 26, marginTop: -6, marginBottom: 10 },
  heroDescription: { color: colors.white, fontSize: 15, lineHeight: 21 },
  heroImage: { width: 130, height: 140, borderRadius: 14, marginTop: -8 },
  search: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 22, color: colors.dark, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: colors.dark },
  breakdown: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  breakdownTitle: { fontSize: 18, fontWeight: '800', color: colors.dark, marginBottom: 12 },
  chips: { gap: 10 },
  chip: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.highlight,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: '700' },
  chipTextActive: { color: colors.white },
  item: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  itemText: { flex: 1 },
  itemName: { fontSize: 17, fontWeight: '700', color: colors.dark, marginBottom: 6 },
  itemDescription: { color: colors.primary, fontSize: 14, lineHeight: 19, marginBottom: 6 },
  itemPrice: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  itemImage: { width: 88, height: 88, borderRadius: 6, backgroundColor: colors.highlight },
  separator: { height: 1, backgroundColor: colors.highlight, marginHorizontal: 16 },
  empty: { padding: 32 },
  emptyText: { textAlign: 'center', color: colors.primary },
});
