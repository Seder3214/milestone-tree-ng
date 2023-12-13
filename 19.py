def f(s, m):
    if s >= 100: return m%2==0
    if m == 0: return 0
    h = [f(s+7, m-1), f(s*2, m-1)]
    return any(h) if m%2!=0 else all(h) # меняем all на any в 19 задаче
print(19, max(s for s in range(1, 100) if f(s, 2)))
print(20, [s for s in range(1, 100) if not f(s, 1) and f(s, 3)][:2])
print(21, min(s for s in range(1, 100) if not f(s, 2) and f(s, 4)))