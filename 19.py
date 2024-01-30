def f(s,s2, m):
    if s+s2 >= 449: return m%2==0
    if m == 0: return 0
    h = [f(s+1,s2, m-1), f(s*2,s2, m-1),f(s,s2+1, m-1), f(s,s2*2, m-1)]
    return any(h) if m%2!=0 else all(h) # меняем all на any в 19 задаче
print(19, min(s2 for s2 in range(1, 449) if f(11,s2, 2)))
print(20, [s2 for s2 in range(1, 449) if not f(11,s2, 1) and f(11,s2, 3)][:2])
print(21, min(s2 for s2 in range(1, 449) if not f(11,s2, 2) and f(11,s2, 4)))