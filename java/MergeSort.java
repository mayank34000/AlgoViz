package sorting;

import java.util.Arrays;

public class MergeSort {

    public static void sort(int[] arr) {
        if (arr.length <= 1) return;
        mergeSort(arr, 0, arr.length - 1);
    }

    private static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;

        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int[] leftSlice  = Arrays.copyOfRange(arr, left, mid + 1);
        int[] rightSlice = Arrays.copyOfRange(arr, mid + 1, right + 1);

        int i = 0, j = 0, k = left;

        while (i < leftSlice.length && j < rightSlice.length) {
            if (leftSlice[i] <= rightSlice[j]) {
                arr[k++] = leftSlice[i++];
            } else {
                arr[k++] = rightSlice[j++];
            }
        }

        while (i < leftSlice.length)  arr[k++] = leftSlice[i++];
        while (j < rightSlice.length) arr[k++] = rightSlice[j++];
    }

    public static void main(String[] args) {
        int[] arr = { 38, 27, 43, 3, 9, 82, 10 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [3, 9, 10, 27, 38, 43, 82]
    }
}
