import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  HOURS_MAX,
  MINUTES_MAX,
  SECONDS_MAX,
  initialPadIndex,
  padValues,
  valueFromPadIndex,
} from '../wheelModel';

interface DurationWheelProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChange: (hours: number, minutes: number, seconds: number) => void;
}

const ROW_HEIGHT = 72;
const VISIBLE_ROWS = 3;
const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const EDGE_PADDING = (WHEEL_HEIGHT - ROW_HEIGHT) / 2;
const LABEL_HEIGHT = 32;
const HOURS_COUNT = HOURS_MAX + 1;
const MINUTES_COUNT = MINUTES_MAX + 1;
const SECONDS_COUNT = SECONDS_MAX + 1;
const SNAP_DELAY_MS = 150;

function WheelColumn({
  count,
  value,
  onChange,
}: {
  count: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const data = useMemo(() => padValues(count), [count]);
  const scrollY = useRef(
    new Animated.Value(initialPadIndex(value, count) * ROW_HEIGHT),
  ).current;
  const listRef = useRef<FlatList<number>>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const index = initialPadIndex(value, count);
    scrollY.setValue(index * ROW_HEIGHT);
    listRef.current?.scrollToOffset({
      offset: index * ROW_HEIGHT,
      animated: false,
    });
  }, [value, count, scrollY]);

  const snapToCenter = (offsetY: number) => {
    const index = Math.round(offsetY / ROW_HEIGHT);
    listRef.current?.scrollToOffset({
      offset: index * ROW_HEIGHT,
      animated: true,
    });
    onChange(valueFromPadIndex(index, count));
  };

  const onScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    snapToCenter(e.nativeEvent.contentOffset.y);
  };

  const onScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (snapTimer.current) clearTimeout(snapTimer.current);
    const offsetY = e.nativeEvent.contentOffset.y;
    snapTimer.current = setTimeout(
      () => snapToCenter(offsetY),
      SNAP_DELAY_MS,
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }) => {
    const scale = scrollY.interpolate({
      inputRange: [
        (index - 1) * ROW_HEIGHT,
        index * ROW_HEIGHT,
        (index + 1) * ROW_HEIGHT,
      ],
      outputRange: [0.8, 1.35, 0.8],
      extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
      inputRange: [
        (index - 1) * ROW_HEIGHT,
        index * ROW_HEIGHT,
        (index + 1) * ROW_HEIGHT,
      ],
      outputRange: [0.45, 1, 0.45],
      extrapolate: 'clamp',
    });
    return (
      <Animated.Text
        style={[styles.row, { opacity, transform: [{ scale }] }]}
      >
        {String(item).padStart(2, '0')}
      </Animated.Text>
    );
  };

  return (
    <Animated.FlatList
      ref={listRef}
      style={styles.column}
      data={data}
      keyExtractor={(_, index) => String(index)}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      snapToInterval={ROW_HEIGHT}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: ROW_HEIGHT,
        offset: ROW_HEIGHT * index,
        index,
      })}
      contentContainerStyle={styles.columnContent}
      initialScrollIndex={initialPadIndex(value, count)}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true, listener: onScroll },
      )}
      onScrollEndDrag={onScrollEnd}
      onMomentumScrollEnd={onScrollEnd}
      scrollEventThrottle={16}
    />
  );
}

function LabeledColumn({
  label,
  count,
  value,
  onChange,
}: {
  label: string;
  count: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.columnGroup}>
      <Text style={styles.columnLabel}>{label}</Text>
      <WheelColumn count={count} value={value} onChange={onChange} />
    </View>
  );
}

export default function DurationWheel({
  hours,
  minutes,
  seconds,
  onChange,
}: DurationWheelProps) {
  return (
    <View style={styles.wheel} accessibilityRole="adjustable">
      <LabeledColumn
        label="Hours"
        count={HOURS_COUNT}
        value={hours}
        onChange={(h) => onChange(h, minutes, seconds)}
      />
      <View style={styles.separatorGroup}>
        <View style={styles.labelSpacer} />
        <View style={styles.separatorWheel}>
          <Text style={styles.separator}>:</Text>
        </View>
      </View>
      <LabeledColumn
        label="Minutes"
        count={MINUTES_COUNT}
        value={minutes}
        onChange={(m) => onChange(hours, m, seconds)}
      />
      <View style={styles.separatorGroup}>
        <View style={styles.labelSpacer} />
        <View style={styles.separatorWheel}>
          <Text style={styles.separator}>:</Text>
        </View>
      </View>
      <LabeledColumn
        label="Seconds"
        count={SECONDS_COUNT}
        value={seconds}
        onChange={(s) => onChange(hours, minutes, s)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: {
    height: LABEL_HEIGHT + WHEEL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  columnGroup: {
    alignItems: 'center',
  },
  columnLabel: {
    height: LABEL_HEIGHT,
    color: '#C4C7D1',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: LABEL_HEIGHT,
    textAlign: 'center',
  },
  column: {
    height: WHEEL_HEIGHT,
    width: 72,
  },
  columnContent: {
    paddingVertical: EDGE_PADDING,
  },
  row: {
    height: ROW_HEIGHT,
    fontSize: 34,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: ROW_HEIGHT,
  },
  separator: {
    fontSize: 30,
    fontWeight: '300',
    color: '#7BC79E',
  },
  separatorGroup: {
    width: 32,
  },
  labelSpacer: {
    height: LABEL_HEIGHT,
  },
  separatorWheel: {
    height: WHEEL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
