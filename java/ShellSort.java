package sorting;

import java.util.Arrays;

public class ShellSort {

    public static void sort(int[] arr) {
        int n = arr.length;

        // Knuth gap sequence: 1, 4, 13, 40, 121, ...
        int gap = 1;
        while (gap < n / 3) gap = gap * 3 + 1;

        while (gap >= 1) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j    = i;

                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }

                arr[j] = temp;
            }

            gap /= 3;
        }
    }

    public static void main(String[] args) {
        int[] arr = { 23, 29, 15, 19, 31, 7, 9, 5, 2 };
        System.out.println("Before: " + Arrays.toString(arr));

        sort(arr);

        System.out.println("After:  " + Arrays.toString(arr));
        // Expected: [2, 5, 7, 9, 15, 19, 23, 29, 31]
    }
}
