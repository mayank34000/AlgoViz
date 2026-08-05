package sorting;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BucketSort {

    public static void sort(int[] arr) {
        int n = arr.length;
        if (n <= 1) return;

        int max = arr[0];
        int min = arr[0];
        for (int v : arr) {
            if (v > max) max = v;
            if (v < min) min = v;
        }

        int range       = max - min + 1;
        int bucketCount = (int) Math.max(2, Math.sqrt(n));

        List<List<Integer>> buckets = new ArrayList<>(bucketCount);
        for (int i = 0; i < bucketCount; i++) buckets.add(new ArrayList<>());

        // Distribute elements into buckets
        for (int v : arr) {
            int idx = Math.min((int) (((long) (v - min) * bucketCount) / range), bucketCount - 1);
            buckets.get(idx).add(v);
        }

        // Sort each bucket and concatenate
        int pos = 0;
        for (List<Integer> bucket : buckets) {
            Collections.sort(bucket);
            for (int v : bucket) arr[pos++] = v;
        }
    }

    public static void main(String[] args) {
        int[] arr = { 29, 25, 3, 49, 9, 37, 21, 43 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [3, 9, 21, 25, 29, 37, 43, 49]
    }
}
