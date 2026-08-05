package sorting;

import java.util.Arrays;

public class RadixSort {

    public static void sort(int[] arr) {
        if (arr.length == 0) return;

        int max = arr[0];
        for (int v : arr) if (v > max) max = v;

        // Process one digit place at a time (ones, tens, hundreds, ...)
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingPassByDigit(arr, exp);
        }
    }

    private static void countingPassByDigit(int[] arr, int exp) {
        int n        = arr.length;
        int[] output = new int[n];
        int[] count  = new int[10];

        // Count digit occurrences
        for (int v : arr) count[(v / exp) % 10]++;

        // Cumulative counts
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];

        // Build output right-to-left for stability
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[--count[digit]] = arr[i];
        }

        System.arraycopy(output, 0, arr, 0, n);
    }

    public static void main(String[] args) {
        int[] arr = { 170, 45, 75, 90, 802, 24, 2, 66 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [2, 24, 45, 66, 75, 90, 170, 802]
    }
}
