import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  findNodeHandle,
  StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type KeyboardScrollContextValue = {
  scrollToFocused: (nativeTag: number) => void;
};

const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(null);

export function useKeyboardScroll() {
  return useContext(KeyboardScrollContext);
}

type Props = ScrollViewProps & {
  centerContent?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function KeyboardAwareScrollView({
  children,
  contentContainerStyle,
  centerContent = false,
  keyboardShouldPersistTaps = 'handled',
  keyboardDismissMode = 'on-drag',
  automaticallyAdjustKeyboardInsets = true,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const scrollToFocused = useCallback((nativeTag: number) => {
    const scroll = scrollRef.current;
    const scrollNode = scroll ? findNodeHandle(scroll) : null;
    if (!scroll || scrollNode == null) return;

    const run = () => {
      UIManager.measureLayout(
        nativeTag,
        scrollNode,
        () => undefined,
        (_left, top) => {
          scroll.scrollTo({
            y: Math.max(0, top - 96),
            animated: true,
          });
        },
      );
    };

    setTimeout(run, Platform.OS === 'ios' ? 80 : 220);
  }, []);

  const contextValue = useMemo(
    () => ({ scrollToFocused }),
    [scrollToFocused],
  );

  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top : 0;

  return (
    <KeyboardScrollContext.Provider value={contextValue}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          keyboardDismissMode={keyboardDismissMode}
          automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
          contentContainerStyle={[
            styles.content,
            centerContent && styles.centered,
            contentContainerStyle,
          ]}
          {...rest}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardScrollContext.Provider>
  );
}

type FlatListWrapperProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Wrap FlatList (or similar) so the keyboard shrinks the visible area on Android/iOS. */
export function KeyboardAvoidingContainer({ children, style }: FlatListWrapperProps) {
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top : 0;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  centered: { justifyContent: 'center' },
});
