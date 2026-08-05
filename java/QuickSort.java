package sorting;

import java.util.Arrays;
import java.util.Random;

public class QuickSort {

    private static final Random RNG = new Random();

    public static void sort(int[] arr) {
        quickSort(arr, 0, arr.length - 1);
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low >= high) return;

        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }

    private static int partition(int[] arr, int low, int high) {
        // Randomise pivot to avoid O(n²) on sorted input
        int randomIdx = low + RNG.nextInt(high - low + 1);
        swap(arr, randomIdx, high);

        int pivot = arr[high];
        int i     = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }

        swap(arr, i + 1, high);
        return i + 1;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i]   = arr[j];
        arr[j]   = temp;
    }

    public static void main(String[] args) {
        int[] arr = { 10, 7, 8, 9, 1, 5 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [1, 5, 7, 8, 9, 10]
    }
}
