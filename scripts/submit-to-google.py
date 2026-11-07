#!/usr/bin/env python3
"""Retired entry point: ordinary articles are outside Google's Indexing API scope.

No credentials are read, no network request is made, and no URL is submitted.
Official scope: https://developers.google.com/search/apis/indexing-api/v3/using-api
"""
import sys

def main() -> int:
    print("No URLs submitted. The Indexing API is for eligible JobPosting or BroadcastEvent pages. Use the sitemap and read-only Search Console reporting for StackGeist articles.", file=sys.stderr)
    return 2

if __name__ == '__main__':
    raise SystemExit(main())
