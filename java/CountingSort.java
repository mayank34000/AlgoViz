package sorting;

import java.util.Arrays;

public class CountingSort {

    public static void sort(int[] arr) {
        if (arr.length == 0) return;

        int max = arr[0];
        int min = arr[0];

        for (int v : arr) {
            if (v > max) max = v;
            if (v < min) min = v;
        }

        int range = max - min + 1;
        int[] count  = new int[range];
        int[] output = new int[arr.length];

        for (int v : arr) count[v - min]++;

        // Cumulative counts — each entry is now the rightmost position for that value
        for (int i = 1; i < range; i++) count[i] += count[i - 1];

        // Build output array right-to-left for stability
        for (int i = arr.length - 1; i >= 0; i--) {
            output[--count[arr[i] - min]] = arr[i];
        }

        System.arraycopy(output, 0, arr, 0, arr.length);
    }

    public static void main(String[] args) {
        int[] arr = { 4, 2, 2, 8, 3, 3, 1 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [1, 2, 2, 3, 3, 4, 8]
    }
}
