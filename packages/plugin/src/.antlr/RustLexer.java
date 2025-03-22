// Generated from /Users/fei/CS/CS4215/CS4215_Proj/packages/plugin/src/Rust.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class RustLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, T__12=13, T__13=14, T__14=15, T__15=16, T__16=17, 
		T__17=18, T__18=19, T__19=20, T__20=21, T__21=22, T__22=23, T__23=24, 
		IDENTIFIER=25, INT=26, WS=27;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", 
			"T__9", "T__10", "T__11", "T__12", "T__13", "T__14", "T__15", "T__16", 
			"T__17", "T__18", "T__19", "T__20", "T__21", "T__22", "T__23", "IDENTIFIER", 
			"INT", "WS"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'let'", "'mut'", "':'", "'='", "';'", "'fn'", "'('", "')'", "'->'", 
			"','", "'{'", "'}'", "'if'", "'else'", "'while'", "'*'", "'/'", "'+'", 
			"'-'", "'>'", "'<'", "'=='", "'!='", "'i64'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, "IDENTIFIER", "INT", "WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public RustLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "Rust.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u001b\u008c\u0006\uffff\uffff\u0002\u0000\u0007\u0000\u0002"+
		"\u0001\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002"+
		"\u0004\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002"+
		"\u0007\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002"+
		"\u000b\u0007\u000b\u0002\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e"+
		"\u0002\u000f\u0007\u000f\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011"+
		"\u0002\u0012\u0007\u0012\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014"+
		"\u0002\u0015\u0007\u0015\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017"+
		"\u0002\u0018\u0007\u0018\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a"+
		"\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001\u0003\u0001\u0003"+
		"\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0006"+
		"\u0001\u0006\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\t\u0001"+
		"\t\u0001\n\u0001\n\u0001\u000b\u0001\u000b\u0001\f\u0001\f\u0001\f\u0001"+
		"\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000f\u0001\u000f\u0001\u0010"+
		"\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0012\u0001\u0012\u0001\u0013"+
		"\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0015\u0001\u0015\u0001\u0015"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0018\u0001\u0018\u0005\u0018|\b\u0018\n\u0018\f\u0018"+
		"\u007f\t\u0018\u0001\u0019\u0004\u0019\u0082\b\u0019\u000b\u0019\f\u0019"+
		"\u0083\u0001\u001a\u0004\u001a\u0087\b\u001a\u000b\u001a\f\u001a\u0088"+
		"\u0001\u001a\u0001\u001a\u0000\u0000\u001b\u0001\u0001\u0003\u0002\u0005"+
		"\u0003\u0007\u0004\t\u0005\u000b\u0006\r\u0007\u000f\b\u0011\t\u0013\n"+
		"\u0015\u000b\u0017\f\u0019\r\u001b\u000e\u001d\u000f\u001f\u0010!\u0011"+
		"#\u0012%\u0013\'\u0014)\u0015+\u0016-\u0017/\u00181\u00193\u001a5\u001b"+
		"\u0001\u0000\u0004\u0003\u0000AZ__az\u0004\u000009AZ__az\u0001\u00000"+
		"9\u0003\u0000\t\n\r\r  \u008e\u0000\u0001\u0001\u0000\u0000\u0000\u0000"+
		"\u0003\u0001\u0000\u0000\u0000\u0000\u0005\u0001\u0000\u0000\u0000\u0000"+
		"\u0007\u0001\u0000\u0000\u0000\u0000\t\u0001\u0000\u0000\u0000\u0000\u000b"+
		"\u0001\u0000\u0000\u0000\u0000\r\u0001\u0000\u0000\u0000\u0000\u000f\u0001"+
		"\u0000\u0000\u0000\u0000\u0011\u0001\u0000\u0000\u0000\u0000\u0013\u0001"+
		"\u0000\u0000\u0000\u0000\u0015\u0001\u0000\u0000\u0000\u0000\u0017\u0001"+
		"\u0000\u0000\u0000\u0000\u0019\u0001\u0000\u0000\u0000\u0000\u001b\u0001"+
		"\u0000\u0000\u0000\u0000\u001d\u0001\u0000\u0000\u0000\u0000\u001f\u0001"+
		"\u0000\u0000\u0000\u0000!\u0001\u0000\u0000\u0000\u0000#\u0001\u0000\u0000"+
		"\u0000\u0000%\u0001\u0000\u0000\u0000\u0000\'\u0001\u0000\u0000\u0000"+
		"\u0000)\u0001\u0000\u0000\u0000\u0000+\u0001\u0000\u0000\u0000\u0000-"+
		"\u0001\u0000\u0000\u0000\u0000/\u0001\u0000\u0000\u0000\u00001\u0001\u0000"+
		"\u0000\u0000\u00003\u0001\u0000\u0000\u0000\u00005\u0001\u0000\u0000\u0000"+
		"\u00017\u0001\u0000\u0000\u0000\u0003;\u0001\u0000\u0000\u0000\u0005?"+
		"\u0001\u0000\u0000\u0000\u0007A\u0001\u0000\u0000\u0000\tC\u0001\u0000"+
		"\u0000\u0000\u000bE\u0001\u0000\u0000\u0000\rH\u0001\u0000\u0000\u0000"+
		"\u000fJ\u0001\u0000\u0000\u0000\u0011L\u0001\u0000\u0000\u0000\u0013O"+
		"\u0001\u0000\u0000\u0000\u0015Q\u0001\u0000\u0000\u0000\u0017S\u0001\u0000"+
		"\u0000\u0000\u0019U\u0001\u0000\u0000\u0000\u001bX\u0001\u0000\u0000\u0000"+
		"\u001d]\u0001\u0000\u0000\u0000\u001fc\u0001\u0000\u0000\u0000!e\u0001"+
		"\u0000\u0000\u0000#g\u0001\u0000\u0000\u0000%i\u0001\u0000\u0000\u0000"+
		"\'k\u0001\u0000\u0000\u0000)m\u0001\u0000\u0000\u0000+o\u0001\u0000\u0000"+
		"\u0000-r\u0001\u0000\u0000\u0000/u\u0001\u0000\u0000\u00001y\u0001\u0000"+
		"\u0000\u00003\u0081\u0001\u0000\u0000\u00005\u0086\u0001\u0000\u0000\u0000"+
		"78\u0005l\u0000\u000089\u0005e\u0000\u00009:\u0005t\u0000\u0000:\u0002"+
		"\u0001\u0000\u0000\u0000;<\u0005m\u0000\u0000<=\u0005u\u0000\u0000=>\u0005"+
		"t\u0000\u0000>\u0004\u0001\u0000\u0000\u0000?@\u0005:\u0000\u0000@\u0006"+
		"\u0001\u0000\u0000\u0000AB\u0005=\u0000\u0000B\b\u0001\u0000\u0000\u0000"+
		"CD\u0005;\u0000\u0000D\n\u0001\u0000\u0000\u0000EF\u0005f\u0000\u0000"+
		"FG\u0005n\u0000\u0000G\f\u0001\u0000\u0000\u0000HI\u0005(\u0000\u0000"+
		"I\u000e\u0001\u0000\u0000\u0000JK\u0005)\u0000\u0000K\u0010\u0001\u0000"+
		"\u0000\u0000LM\u0005-\u0000\u0000MN\u0005>\u0000\u0000N\u0012\u0001\u0000"+
		"\u0000\u0000OP\u0005,\u0000\u0000P\u0014\u0001\u0000\u0000\u0000QR\u0005"+
		"{\u0000\u0000R\u0016\u0001\u0000\u0000\u0000ST\u0005}\u0000\u0000T\u0018"+
		"\u0001\u0000\u0000\u0000UV\u0005i\u0000\u0000VW\u0005f\u0000\u0000W\u001a"+
		"\u0001\u0000\u0000\u0000XY\u0005e\u0000\u0000YZ\u0005l\u0000\u0000Z[\u0005"+
		"s\u0000\u0000[\\\u0005e\u0000\u0000\\\u001c\u0001\u0000\u0000\u0000]^"+
		"\u0005w\u0000\u0000^_\u0005h\u0000\u0000_`\u0005i\u0000\u0000`a\u0005"+
		"l\u0000\u0000ab\u0005e\u0000\u0000b\u001e\u0001\u0000\u0000\u0000cd\u0005"+
		"*\u0000\u0000d \u0001\u0000\u0000\u0000ef\u0005/\u0000\u0000f\"\u0001"+
		"\u0000\u0000\u0000gh\u0005+\u0000\u0000h$\u0001\u0000\u0000\u0000ij\u0005"+
		"-\u0000\u0000j&\u0001\u0000\u0000\u0000kl\u0005>\u0000\u0000l(\u0001\u0000"+
		"\u0000\u0000mn\u0005<\u0000\u0000n*\u0001\u0000\u0000\u0000op\u0005=\u0000"+
		"\u0000pq\u0005=\u0000\u0000q,\u0001\u0000\u0000\u0000rs\u0005!\u0000\u0000"+
		"st\u0005=\u0000\u0000t.\u0001\u0000\u0000\u0000uv\u0005i\u0000\u0000v"+
		"w\u00056\u0000\u0000wx\u00054\u0000\u0000x0\u0001\u0000\u0000\u0000y}"+
		"\u0007\u0000\u0000\u0000z|\u0007\u0001\u0000\u0000{z\u0001\u0000\u0000"+
		"\u0000|\u007f\u0001\u0000\u0000\u0000}{\u0001\u0000\u0000\u0000}~\u0001"+
		"\u0000\u0000\u0000~2\u0001\u0000\u0000\u0000\u007f}\u0001\u0000\u0000"+
		"\u0000\u0080\u0082\u0007\u0002\u0000\u0000\u0081\u0080\u0001\u0000\u0000"+
		"\u0000\u0082\u0083\u0001\u0000\u0000\u0000\u0083\u0081\u0001\u0000\u0000"+
		"\u0000\u0083\u0084\u0001\u0000\u0000\u0000\u00844\u0001\u0000\u0000\u0000"+
		"\u0085\u0087\u0007\u0003\u0000\u0000\u0086\u0085\u0001\u0000\u0000\u0000"+
		"\u0087\u0088\u0001\u0000\u0000\u0000\u0088\u0086\u0001\u0000\u0000\u0000"+
		"\u0088\u0089\u0001\u0000\u0000\u0000\u0089\u008a\u0001\u0000\u0000\u0000"+
		"\u008a\u008b\u0006\u001a\u0000\u0000\u008b6\u0001\u0000\u0000\u0000\u0004"+
		"\u0000}\u0083\u0088\u0001\u0006\u0000\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}