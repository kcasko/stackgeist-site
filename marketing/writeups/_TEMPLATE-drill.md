# Drill writeup template

**Use this when publishing a drill writeup from the AD lab, PowerShell, OPNsense, GOAD, HTB, or Help Desk skills.** The perf writeup at `2026-09-13-perf-81-to-100.md` is the shape reference — same discipline applies.

Fill in every `<...>` before shipping. Delete every guidance comment (lines starting with `>` at the top of each section) before commit.

---

# <One-line hook that names the concrete win>

> Hook rule: state the outcome in numbers or a specific event, not adjectives. "Fixed a Kerberos time-skew that killed a whole domain" beats "Learned about Kerberos."

<Two sentences setting scope. What you drilled, what the outcome was, what this writeup covers.>

- <Concrete result 1 with a number or a captured artifact>
- <Concrete result 2>
- <Concrete result 3>
- <One-sentence "what this is not" so readers self-filter>

## The setup

> Show your lab in one paragraph. Version numbers matter. Screenshot or `Get-*` output beats prose.

- Environment: <VMware Workstation 17 Pro, DC01 Server 2022, WIN11-01, OPNsense, VMnet layout>
- Domain / range: <lab.local | GOAD sevenkingdoms.local | HTB Retired>
- Snapshot state at start: <`baseline` on both VMs>
- Repo where transcripts + configs live: `D:\Repos\ad-lab\...`

## The task

> What the drill actually was, in one paragraph. If it maps to a Sec+ / Net+ / AZ-800 objective or a MITRE ATT&CK ID, name it here.

- Objective: <Sec+ 3.4 identity and access | ATT&CK T1558.003 Kerberoasting>
- Success criterion: <exact string / event ID / captured artifact>
- Time budget: <target vs actual>

## What I actually did (transcript excerpts)

> Paste 3-8 command blocks from the transcript. Not the whole log — the moves that mattered. Preserve the actual output; do not paraphrase.

```powershell
# Excerpt from D:\Repos\ad-lab\transcripts\<file>.log
<paste real commands + output>
```

```
<second excerpt if useful>
```

## Where it went wrong (and how I diagnosed it)

> Every good writeup shows one thing that broke. If the drill ran clean, invent a break/fix scenario (documented as such) and drill it.

- Symptom: <exact error message or observed behavior>
- Diagnostic move: <what you ran to isolate it>
- Root cause: <one sentence, with a source link if it's a Microsoft/Sigma/MITRE-documented thing>
- Fix: <exact command that resolved it>

## What I would do differently

> Retrospective, honest. Not "I could have been faster" — a specific move for next time.

- <One concrete change to the drill procedure>
- <One tool or reference you would add to your kit>

## The detection pair-up (only for GOAD / HTB / attack drills)

> If this was an attack drill, map the attack to a defender's view. Skip this section for pure sysadmin drills.

| Attack step | Event ID(s) on DC | Sigma rule name | Log source |
|---|---|---|---|
| <ex: SPN enumeration> | 4769 | `win_susp_spn_enumeration` | Windows Security |
| <...> | | | |

This is the section that turns "I did HTB boxes" into "I understand blue-team." Do not skip.

## Cert / job-map

> One sentence per bullet. This is what a hiring manager or a study partner scans first.

- Sec+ objective: <SY0-701 4.3 monitoring...>
- Net+ objective: <if applicable>
- AZ-800 objective: <if applicable>
- Interview question this answers: "<paste the actual question you'd expect>"

## Reproducible steps

> A hiring manager or a study buddy should be able to walk this in their own lab. If you can't write these, you did not really understand the drill.

1. <step 1>
2. <step 2>
3. <step 3>
   ...

## Sanitization checklist (do this BEFORE ship)

- [ ] Real hostnames replaced with `DC01` / `WIN11-01` / `lab.local`
- [ ] Real IPs replaced (`10.10.10.10` style is fine — lab-only ranges)
- [ ] No credentials, hashes, tickets, or NTLM material in commands or output
- [ ] No screenshots showing Windows user path (`C:\Users\<real-name>`)
- [ ] No Cloudflare account ID, RUM tag, or Cloudflare API token
- [ ] Every technique cited via `grounded-citations` — real URLs, dated
- [ ] `unslop-cleanup-workflow` pass — no AI-tells

## Publish checklist

- [ ] Writeup file at `marketing/writeups/<yyyy-MM-dd>-<slug>.md`
- [ ] Repurposed atoms at `marketing/writeups/<yyyy-MM-dd>-<slug>.repurposed.md` (LinkedIn / X thread / TikTok scripts / Reddit playbook / newsletter blurb)
- [ ] UTM taxonomy set: `?utm_source=<platform>&utm_medium=<format>&utm_campaign=<slug>`
- [ ] Not scheduled for Nov 10-17 2026 (SSDI hearing blackout)
- [ ] 14-day check calendar entry set — did any platform actually convert?

## Related drills

- <link to the SKILL.md this drill came from>
- <link to a sibling drill in the same range>
- <link to the previous drill in the sequence, if any>
